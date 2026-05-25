'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowUp, Edit2, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import AdminModal from '@/components/admin/AdminModal';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import ImageUploader from '@/components/admin/ImageUploader';
 

type MediaType = 'image' | 'video';

type EventMedia = {
  _id?: string;
  imageUrl: string;
  mediaType?: MediaType;
  posterUrl?: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
};

type FeaturedEvent = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  time: string;
  media: EventMedia[];
  isActive: boolean;
  order: number;
  createdAt: Date;
};

export default function FeaturedEventsPage() {
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  const [formData, setFormData] = useState<Omit<FeaturedEvent, '_id' | 'createdAt'>>({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    date: '',
    time: '',
    media: [],
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/featured-events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch featured events');
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingEventId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      location: '',
      date: '',
      time: '',
      media: [],
      isActive: true,
      order: 0,
    });
    resetMediaForm();
    setIsModalOpen(true);
  }

  function openEditModal(event: FeaturedEvent) {
    setEditingEventId(event._id);
    setFormData({
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      location: event.location,
      date: event.date,
      time: event.time,
      media: (event.media || []).filter((m) => (m.mediaType || 'image') === 'image'),
      isActive: event.isActive,
      order: event.order,
    });
    resetMediaForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingEventId(null);
    resetMediaForm();
  }

  function resetMediaForm() {
    setMediaUrl('');
    setCaption('');
  }

  async function persistEventOrder(nextEvents: FeaturedEvent[]) {
    const reorderedEvents = nextEvents.map((event, index) => ({
      ...event,
      order: index,
    }));

    setEvents(reorderedEvents);

    try {
      const res = await fetch('/api/featured-events/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: reorderedEvents.map(({ _id, order }) => ({ _id, order })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reorder');
      }

      toast.success('Events reordered');
    } catch (error) {
      toast.error('Failed to save reorder');
      await fetchEvents();
    }
  }

  async function handleSaveEvent() {
    // Validate all required fields
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.subtitle?.trim()) {
      toast.error('Subtitle is required');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.location?.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!formData.date?.trim()) {
      toast.error('Date is required');
      return;
    }
    if (!formData.time?.trim()) {
      toast.error('Time is required');
      return;
    }
    // require exactly one image in the media gallery
    if (!formData.media || formData.media.length !== 1) {
      toast.error('Exactly one image is required for the featured event');
      return;
    }

    try {
      setIsSaving(true);

      if (editingEventId) {
        const res = await fetch(`/api/featured-events/${editingEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update event');
        }
        toast.success('Featured event updated');
      } else {
        const res = await fetch('/api/featured-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to create event');
        }
        toast.success('Featured event created');
      }

      await fetchEvents();
      closeModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save featured event';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddMedia() {
    if (!mediaUrl) {
      toast.error('Image URL is required');
      return;
    }

    const newMedia = {
      imageUrl: mediaUrl,
      mediaType: 'image' as MediaType,
      posterUrl: '',
      caption,
      order: 0,
      isActive: true,
    };

    // replace any existing media — enforce single-image per event
    setFormData({
      ...formData,
      media: [newMedia],
    });

    toast.success(formData.media.length > 0 ? 'Image replaced' : 'Image added');
    resetMediaForm();
  }

  async function handleDeleteMedia() {
    // For single-image mode, just clear the media array
    setFormData({ ...formData, media: [] });
    toast.success('Image removed');
  }

  async function handleToggleEvent(eventId: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/featured-events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error('Failed to toggle event');
      await fetchEvents();
      toast.success(isActive ? 'Event deactivated' : 'Event activated');
    } catch (error) {
      toast.error('Failed to toggle event');
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/featured-events/${eventId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete event');
      await fetchEvents();
      toast.success('Featured event deleted');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete featured event');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleMoveEvent(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= events.length) {
      return;
    }

    const nextEvents = [...events];
    const [movedEvent] = nextEvents.splice(index, 1);
    nextEvents.splice(targetIndex, 0, movedEvent);

    void persistEventOrder(nextEvents);
  }

  async function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newEvents = [...events];
    const [draggedEvent] = newEvents.splice(draggedIndex, 1);
    newEvents.splice(targetIndex, 0, draggedEvent);
    setDraggedIndex(null);

    await persistEventOrder(newEvents);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-white/5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Carousel curation
            </p>
            <h1 className="mt-4 font-serif text-4xl text-white/92 sm:text-5xl">
              Featured Events ({events.length})
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              Create the homepage carousel lineup, attach a single hero image to each event, and reorder entries with drag-and-drop or the move controls below.
            </p>
          </div>
          <AdminButton onClick={openCreateModal} className="flex items-center gap-2">
            <Plus size={18} /> Add Featured Event
          </AdminButton>
        </div>

        {events.length === 0 ? (
          <div className="bg-white/5 border border-white/10 border-dashed rounded-xl shadow p-12 text-center">
            <p className="text-white/55 mb-4">No featured events yet. Add the first carousel spotlight.</p>
            <AdminButton onClick={openCreateModal} className="flex items-center gap-2 mx-auto">
              <Plus size={18} /> Create First Featured Event
            </AdminButton>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4 text-xs leading-6 text-white/55">
              Tip: drag rows on desktop, or use the move buttons for touch and keyboard reordering.
            </div>
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em] w-8"></th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Media</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Move</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-[0.28em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {events.map((event, index) => (
                  <tr
                    key={event._id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => setDraggedIndex(null)}
                    className="border-b border-white/10 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-6 py-4 cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} className="text-white/40" />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/85 font-semibold">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white/90">{event.title}</div>
                        <div className="text-xs text-white/50">{event.subtitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{event.date || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block bg-white/10 border border-white/20 px-2 py-1 rounded text-white/70 text-xs">
                        {event.media.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleEvent(event._id, event.isActive)}
                        className="text-white/60 hover:text-white/90 transition"
                      >
                        {event.isActive ? (
                          <Eye size={16} className="text-teal-300" />
                        ) : (
                          <EyeOff size={16} className="text-white/40" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveEvent(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${event.title} up`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-teal-300/40 hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => handleMoveEvent(index, 1)}
                          disabled={index === events.length - 1}
                          aria-label={`Move ${event.title} down`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-teal-300/40 hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="text-teal-300/70 hover:text-teal-300 transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event._id)}
                          className="text-red-400/70 hover:text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AdminModal isOpen={isModalOpen} onClose={closeModal} title={editingEventId ? 'Edit Featured Event' : 'Create Featured Event'}>
        <div className="space-y-6">
          <AdminInput
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Event Title"
          />

          <AdminInput
            label="Subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Event Subtitle"
          />

          <AdminTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Event Description"
          />

          <AdminInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event Location"
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Date"
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="e.g., April 8, 2026"
            />

            <AdminInput
              label="Time"
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g., 6:00 PM"
            />
          </div>

          {/* Media Gallery Section */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold mb-4 text-[0.75rem] uppercase tracking-[0.26em] text-teal-200/75">
              Media Gallery
            </h3>

            {/* Add Media Form (images only) */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-[0.26em]">Upload Image (required)</label>
                <ImageUploader
                  value={mediaUrl}
                  onChange={(url: string) => setMediaUrl(url)}
                  label="Upload Image"
                  required
                />
              </div>

              <AdminInput
                label="Caption (Optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption"
              />

              <AdminButton
                onClick={handleAddMedia}
                disabled={!mediaUrl}
                className="w-full"
              >
                {formData.media.length > 0 ? 'Replace Image' : 'Add Image'}
              </AdminButton>
            </div>

            {/* Media List */}
            {formData.media.length > 0 && (
              <div className="space-y-2">
                {formData.media.map((media, idx) => (
                  <div key={media._id} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={media.imageUrl} alt={`Featured ${idx + 1}`} className="w-28 h-16 object-cover rounded-md border border-white/10" />
                      <div>
                        <p className="text-sm font-medium text-white/90">{idx + 1}. 🖼️ Image</p>
                        {media.caption && <p className="text-xs text-white/50">{media.caption}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteMedia()}
                        className="text-red-400/70 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <AdminButton
              onClick={handleSaveEvent}
              disabled={isSaving}
              variant="primary"
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Event'}
            </AdminButton>
            <AdminButton onClick={closeModal} variant="secondary" className="flex-1">
              Cancel
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm !== null}
        title="Delete Featured Event"
        message="Are you sure you want to delete this featured event? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => deleteConfirm && handleDeleteEvent(deleteConfirm)}
        isLoading={isDeleting}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
