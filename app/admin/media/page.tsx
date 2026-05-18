'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Edit2, Plus, Trash2 } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminModal from '@/components/admin/AdminModal';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import VideoUploader from '@/components/admin/VideoUploader';

type MediaType = 'image' | 'video';

type MediaItem = {
  _id: string;
  imageUrl: string;
  mediaType?: MediaType;
  posterUrl?: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<'close' | 'add-another'>('close');

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch media');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveMedia() {
    if (!mediaUrl) {
      toast.error(mediaType === 'video' ? 'Video URL is required' : 'Image URL is required');
      return;
    }

    if (mediaType === 'video' && !posterUrl) {
      toast.error('Add a poster image for the video preview');
      return;
    }

    try {
      setIsSubmitting(true);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/media/${editingId}` : '/api/media';
      const order = editingId ? media.find((item) => item._id === editingId)?.order ?? media.length : media.length;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: mediaUrl,
          mediaType,
          posterUrl: mediaType === 'video' ? posterUrl : '',
          caption,
          order,
        }),
      });

      if (!res.ok) throw new Error('Failed to save media');

      toast.success(editingId ? 'Media updated' : 'Media added');
      await fetchMedia();

      if (editingId || saveMode === 'close') {
        closeModal();
      } else {
        resetForm({ keepOpen: true, keepType: mediaType });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/media/${deleteConfirm}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Media deleted');
      setDeleteConfirm(null);
      await fetchMedia();
    } catch (error) {
      toast.error('Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  }

  function openEditModal(item: any) {
    const itemType = (item.mediaType || 'image') as MediaType;
    setEditingId(item._id);
    setMediaType(itemType);
    setMediaUrl(item.imageUrl);
    setPosterUrl(item.posterUrl || '');
    setCaption(item.caption || '');
    setIsModalOpen(true);
  }

  function resetForm(options?: { keepOpen?: boolean; keepType?: MediaType }) {
    setEditingId(null);
    setMediaUrl('');
    setPosterUrl('');
    setCaption('');
    setMediaType(options?.keepType ?? 'image');
    if (!options?.keepOpen) {
      setIsModalOpen(false);
    }
  }

  function closeModal() {
    resetForm();
  }

  function openAddModal() {
    resetForm({ keepOpen: true });
    setIsModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">Content library</p>
          <h1 className="mt-4 font-serif text-4xl text-white/92 sm:text-5xl">Media Gallery</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
            Add images and videos as individual entries, reorder them with the order field, and keep the public gallery in sync.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminButton onClick={openAddModal} variant="primary">
            <Plus size={18} className="mr-2 inline" />
            Add Media
          </AdminButton>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_12px_42px_rgba(0,0,0,0.16)] transition hover:border-white/20"
            >
              <div className="relative overflow-hidden bg-black/20">
                <div className="relative aspect-4/3 w-full">
                  {item.mediaType === 'video' ? (
                    <video
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={item.posterUrl || item.imageUrl}
                    >
                      <source src={item.imageUrl} />
                    </video>
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.caption || 'Media item'}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-[#041114]/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
                    {item.mediaType || 'image'}
                  </span>
                  {item.isActive === false ? (
                    <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-red-200 backdrop-blur-sm">
                      Hidden
                    </span>
                  ) : (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-emerald-100 backdrop-blur-sm">
                      Live
                    </span>
                  )}
                </div>
                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-xl border border-white/10 bg-[#041114]/85 p-2 text-white transition hover:border-teal-300/40 hover:bg-[#07171a]"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item._id)}
                    className="rounded-xl border border-white/10 bg-[#041114]/85 p-2 text-white transition hover:border-red-300/40 hover:bg-[#07171a]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white/85">{item.caption || 'Untitled media'}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-white/45">
                    #{item.order ?? 0}
                  </span>
                </div>
                <p className="break-all text-xs leading-5 text-white/45">{item.imageUrl}</p>
                {item.mediaType === 'video' && item.posterUrl ? (
                  <p className="text-xs leading-5 text-white/45">Poster: {item.posterUrl}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Media' : 'Add New Media'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.26em] text-white/50">
                Media Type
              </label>
              <select
                value={mediaType}
                onChange={(e) => {
                  const nextType = e.target.value as MediaType;
                  setMediaType(nextType);
                  if (nextType === 'image') {
                    setPosterUrl('');
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-white/90 transition duration-300 focus:border-teal-300/50 focus:bg-[#07171a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)]"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-sm text-white/60">
              <p className="text-xs uppercase tracking-[0.26em] text-white/45">Display order</p>
              <p className="mt-2 text-white/85">{media.find((item) => item._id === editingId)?.order ?? media.length}</p>
            </div>
          </div>

          {mediaType === 'image' ? (
            <ImageUploader label="Image" value={mediaUrl} onChange={setMediaUrl} required />
          ) : (
            <VideoUploader label="Video" value={mediaUrl} onChange={setMediaUrl} required />
          )}

          {mediaType === 'video' ? (
            <ImageUploader label="Poster image" value={posterUrl} onChange={setPosterUrl} required />
          ) : null}

          <AdminInput
            label="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe the moment"
          />

          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              <input
                type="radio"
                name="saveMode"
                checked={saveMode === 'close'}
                onChange={() => setSaveMode('close')}
                className="accent-teal-300"
              />
              Save and close
            </label>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              <input
                type="radio"
                name="saveMode"
                checked={saveMode === 'add-another'}
                onChange={() => setSaveMode('add-another')}
                className="accent-teal-300"
              />
              Save and add another
            </label>
          </div>

          <div className="flex gap-4">
            <AdminButton type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </AdminButton>
            <AdminButton type="button" variant="primary" onClick={handleSaveMedia} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update Media' : saveMode === 'add-another' ? 'Save & Add Another' : 'Add Media'}
            </AdminButton>
          </div>

          {editingId ? (
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-emerald-200/80">
              <Check size={14} /> You are editing an existing item
            </p>
          ) : null}
        </div>
      </AdminModal>

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
