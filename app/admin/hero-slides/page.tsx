'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import AdminModal from '@/components/admin/AdminModal';
import AdminTable from '@/components/admin/AdminTable';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import VideoUploader from '@/components/admin/VideoUploader';
import { heroSlideSchema, type HeroSlideFormData } from '../../../lib/hero-slides';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [formFeedback, setFormFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: { order: 0 },
  });

  const imageUrlValue = watch('imageUrl');
  const videoUrlValue = watch('videoUrl');
  const titleValue = watch('title');
  const descriptionValue = watch('description');

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (editingId && slides.length > 0) {
      const slide = slides.find((s) => s._id === editingId);
      if (slide) {
        const type: 'image' | 'video' = slide.videoUrl ? 'video' : 'image';
        setMediaType(type);
        setTimeout(() => {
          reset({
            imageUrl: type === 'image' ? (slide.imageUrl || '') : '',
            videoUrl: type === 'video' ? (slide.videoUrl || '') : '',
            title: slide.title,
            description: slide.description || '',
            order: slide.order || 0,
          });
        }, 0);
      }
    }
  }, [editingId, slides, reset]);

  async function fetchSlideById(id: string) {
    try {
      const res = await fetch(`/api/hero-slides/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const slide = await res.json();
      return slide;
    } catch (error) {
      console.error('Error fetching slide:', error);
      return null;
    }
  }

  async function fetchSlides() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/hero-slides');
      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || 'Failed to fetch hero slides');
      }
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch hero slides';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: HeroSlideFormData) {
    try {
      setFormFeedback(null);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/hero-slides/${editingId}` : '/api/hero-slides';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        const details = Array.isArray(error?.details) ? error.details : [];
        throw new Error(details[0] || error?.error || 'Failed to save slide');
      }

      setFormFeedback({
        type: 'success',
        message: editingId ? 'Slide updated successfully.' : 'Slide created successfully.',
      });
      toast.success(editingId ? 'Slide updated' : 'Slide created');
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      await fetchSlides();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setFormFeedback({ type: 'error', message });
      toast.error(message);
    }
  }

  function onInvalid() {
    const message = 'Check the highlighted fields and try again.';
    setFormFeedback({ type: 'error', message });
    toast.error(message);
  }

  async function handleDelete() {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/hero-slides/${deleteConfirm}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Slide deleted');
      setDeleteConfirm(null);
      await fetchSlides();
    } catch (error) {
      toast.error('Failed to delete slide');
    } finally {
      setIsDeleting(false);
    }
  }

  function openEditModal(slide: any) {
    setMediaType(slide.videoUrl ? 'video' : 'image');
    setEditingId(slide._id);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setMediaType('image');
    setFormFeedback(null);
    reset();
  }

  const columns = [
    {
      key: 'imageUrl',
      label: 'Media',
      render: (imageUrl: string, row: any) => {
        if (row.videoUrl) {
          return (
            <div className="relative w-16 h-10 rounded overflow-hidden bg-black/40 flex items-center justify-center">
              {imageUrl && (
                <img src={imageUrl} alt="Slide" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              )}
              <Video size={14} className="relative text-teal-300" />
            </div>
          );
        }
        if (imageUrl) {
          return <img src={imageUrl} alt="Slide" className="w-16 h-10 rounded object-cover" />;
        }
        return (
          <div className="w-16 h-10 rounded bg-white/10 flex items-center justify-center text-white/30 text-xs">
            —
          </div>
        );
      },
    },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'order', label: 'Order' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteConfirm(row._id)}
            className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-white/90">Hero Slides</h1>
          <p className="text-white/50 mt-1 sm:mt-2 text-sm sm:text-base">Manage carousel slides on the homepage</p>
        </div>
        <AdminButton
          onClick={() => {
            setMediaType('image');
            reset({ imageUrl: '', videoUrl: '', title: '', description: '', order: 0 });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus size={18} className="inline mr-2" />
          Add Slide
        </AdminButton>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-3">
            {slides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/50">No slides yet</p>
              </div>
            ) : (
              slides.map((slide) => (
                <div
                  key={slide._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="shrink-0">
                    {slide.videoUrl ? (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                        {slide.imageUrl && (
                          <img src={slide.imageUrl} alt="Slide" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        )}
                        <Video size={16} className="relative text-teal-300" />
                      </div>
                    ) : slide.imageUrl ? (
                      <img src={slide.imageUrl} alt="Slide" className="w-16 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white/30 text-xs">—</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-sm font-medium truncate">{slide.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">Order: {slide.order}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(slide._id)}
                      className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white/5 border border-white/10 rounded-[1.8rem] p-6 backdrop-blur-sm overflow-hidden">
            <AdminTable columns={columns} data={slides} />
          </div>
        </>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Slide' : 'Add New Slide'}
      >
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Add exactly one media asset, then complete the title and order.
          </div>

          {formFeedback && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                formFeedback.type === 'error'
                  ? 'border-red-400/30 bg-red-500/10 text-red-100'
                  : 'border-teal-300/30 bg-teal-500/10 text-teal-50'
              }`}
            >
              {formFeedback.message}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-widest">Media</p>
            <p className="text-xs text-white/45">Choose image or video, then upload one file only.</p>
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setMediaType('image');
                  setValue('videoUrl', '', { shouldValidate: true });
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  mediaType === 'image'
                    ? 'bg-teal-300 text-slate-950'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <ImageIcon size={14} />
                Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setMediaType('video');
                  setValue('imageUrl', '', { shouldValidate: true });
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  mediaType === 'video'
                    ? 'bg-teal-300 text-slate-950'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Video size={14} />
                Video
              </button>
            </div>

            {mediaType === 'image' ? (
              <ImageUploader
                label="Image"
                value={imageUrlValue || ''}
                onChange={(url) => setValue('imageUrl', url, { shouldValidate: true })}
                error={errors.imageUrl?.message}
                required={mediaType === 'image'}
              />
            ) : (
              <VideoUploader
                label="Video"
                value={videoUrlValue || ''}
                onChange={(url) => setValue('videoUrl', url, { shouldValidate: true })}
                error={errors.videoUrl?.message}
                required={mediaType === 'video'}
              />
            )}
          </div>
          <AdminInput
            label="Title"
              value={titleValue || ''}
              {...register('title')}
            error={errors.title?.message}
            required
          />
          <AdminTextarea
            label="Description"
            rows={3}
              value={descriptionValue || ''}
              {...register('description')}
            error={errors.description?.message}
          />
          <AdminInput
            label="Order"
            type="number"
            {...register('order', { valueAsNumber: true })}
            error={errors.order?.message}
            required
          />

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <AdminButton type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Slide'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Slide"
        message="Are you sure you want to delete this slide? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
