'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Edit2, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import AdminModal from '@/components/admin/AdminModal';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import VideoUploader from '@/components/admin/VideoUploader';

type MediaType = 'image' | 'video';

type EventMedia = {
  _id: string;
  imageUrl: string;
  mediaType?: MediaType;
  posterUrl?: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
};

type FeaturedEvent = {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  time: string;
  media: EventMedia[];
  isActive: boolean;
};

export default function FeaturedEventPage() {
  const [event, setEvent] = useState<FeaturedEvent>({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    date: '',
    time: '',
    media: [],
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  async function fetchEvent() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/featured-event');
      const data = await res.json();
      setEvent(data);
    } catch (error) {
      toast.error('Failed to fetch featured event');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveEvent() {
    if (!event.title) {
      toast.error('Event title is required');
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch('/api/featured-event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!res.ok) throw new Error('Failed to save event');
      toast.success('Featured event updated');
    } catch (error) {
      toast.error('Failed to save featured event');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddMedia() {
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
      const res = await fetch('/api/featured-event/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: mediaUrl,
          mediaType,
          posterUrl: mediaType === 'video' ? posterUrl : '',
          caption,
        }),
      });

      if (!res.ok) throw new Error('Failed to add media');
      const updated = await res.json();
      setEvent(updated);
      toast.success('Media added');
      closeModal();
    } catch (error) {
      toast.error('Failed to add media');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateMedia() {
    if (!editingMediaId) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/featured-event/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId: editingMediaId,
          imageUrl: mediaUrl,
          mediaType,
          posterUrl: mediaType === 'video' ? posterUrl : '',
          caption,
        }),
      });

      if (!res.ok) throw new Error('Failed to update media');
      const updated = await res.json();
      setEvent(updated);
      toast.success('Media updated');
      closeModal();
    } catch (error) {
      toast.error('Failed to update media');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteMedia() {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/featured-event/media?mediaId=${deleteConfirm}`,
        { method: 'DELETE' }
      );

      if (!res.ok) throw new Error('Failed to delete');
      const updated = await res.json();
      setEvent(updated);
      toast.success('Media deleted');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  }

  function openEditMediaModal(media: EventMedia) {
    setEditingMediaId(media._id);
    setMediaType((media.mediaType || 'image') as MediaType);
    setMediaUrl(media.imageUrl);
    setPosterUrl(media.posterUrl || '');
    setCaption(media.caption || '');
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingMediaId(null);
    setMediaUrl('');
    setPosterUrl('');
    setCaption('');
    setMediaType('image');
    setIsModalOpen(false);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-8">
      {/* Event Details Section */}
      <div>
        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Editorial feature
            </p>
            <h1 className="mt-4 font-serif text-4xl text-white/92 sm:text-5xl">
              Featured Event
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              Set the hero event that appears on the homepage. Configure the title, details, and media gallery.
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AdminInput
              label="Event Title"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              placeholder="e.g., Wine & Dine Wednesdays"
              required
            />
            <AdminInput
              label="Subtitle"
              value={event.subtitle}
              onChange={(e) => setEvent({ ...event, subtitle: e.target.value })}
              placeholder="e.g., Your after-work ritual"
            />
          </div>

          <AdminTextarea
            label="Description"
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            placeholder="Write a compelling description..."
            rows={4}
          />

          <div className="grid gap-6 md:grid-cols-3">
            <AdminInput
              label="Location"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              placeholder="e.g., The Terrace, Lekki"
            />
            <AdminInput
              label="Date"
              value={event.date}
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
              placeholder="e.g., April 8th"
            />
            <AdminInput
              label="Time"
              value={event.time}
              onChange={(e) => setEvent({ ...event, time: e.target.value })}
              placeholder="e.g., 6PM – 9PM"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              <input
                type="checkbox"
                checked={event.isActive}
                onChange={(e) => setEvent({ ...event, isActive: e.target.checked })}
                className="accent-teal-300"
              />
              Active
            </label>
            <p className="text-xs text-white/45">
              {event.isActive ? 'This event is visible on the site' : 'This event is hidden'}
            </p>
          </div>

          <AdminButton onClick={handleSaveEvent} variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Event Details'}
          </AdminButton>
        </div>
      </div>

      {/* Media Gallery Section */}
      <div>
        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Media gallery
            </p>
            <h2 className="mt-4 font-serif text-3xl text-white/92">
              Hero Media ({event.media.length})
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              Add hero images or videos that will display in the featured event section.
            </p>
          </div>
          <AdminButton onClick={() => setIsModalOpen(true)} variant="primary">
            <Plus size={18} className="mr-2 inline" />
            Add Media
          </AdminButton>
        </div>

        {event.media.length === 0 ? (
          <div className="rounded-lg border border-white/10 border-dashed bg-white/5 px-6 py-12 text-center">
            <p className="text-sm text-white/55">No media yet. Add your first hero image or video.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {event.media.map((media) => (
              <div
                key={media._id}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_12px_42px_rgba(0,0,0,0.16)] transition hover:border-white/20"
              >
                <div className="relative overflow-hidden bg-black/20">
                  <div className="relative aspect-4/3 w-full">
                    {media.mediaType === 'video' ? (
                      <video
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster={media.posterUrl || media.imageUrl}
                      >
                        <source src={media.imageUrl} />
                      </video>
                    ) : (
                      <img
                        src={media.imageUrl}
                        alt={media.caption || 'Featured media'}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-full border border-white/12 bg-[#041114]/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
                      {media.mediaType || 'image'}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => openEditMediaModal(media)}
                      className="rounded-xl border border-white/10 bg-[#041114]/85 p-2 text-white transition hover:border-teal-300/40 hover:bg-[#07171a]"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(media._id)}
                      className="rounded-xl border border-white/10 bg-[#041114]/85 p-2 text-white transition hover:border-red-300/40 hover:bg-[#07171a]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-sm font-medium text-white/85">
                    {media.caption || 'Untitled media'}
                  </p>
                  <p className="break-all text-xs leading-5 text-white/45">{media.imageUrl}</p>
                  {media.mediaType === 'video' && media.posterUrl ? (
                    <p className="text-xs leading-5 text-white/45">
                      Poster: {media.posterUrl}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMediaId ? 'Edit Media' : 'Add Media to Featured Event'}
        size="lg"
      >
        <div className="space-y-6">
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
            placeholder="Describe the media"
          />

          <div className="flex gap-4">
            <AdminButton type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              onClick={editingMediaId ? handleUpdateMedia : handleAddMedia}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingMediaId ? 'Update Media' : 'Add Media'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        onConfirm={handleDeleteMedia}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
