'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit2, Film, Plus, Trash2 } from 'lucide-react';
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

type PastEvent = {
  _id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  media: EventMedia[];
  span?: string;
  isActive: boolean;
  order: number;
};

export default function PastEventsPage() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteMediaConfirm, setDeleteMediaConfirm] = useState<{ eventId: string; mediaId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event form states
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventYear, setEventYear] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Media form states
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/past-events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch past events');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveEvent() {
    if (!eventTitle || !eventCategory || !eventYear) {
      toast.error('Title, category, and year are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const method = editingEventId ? 'PUT' : 'POST';
      const url = editingEventId
        ? `/api/past-events/${editingEventId}`
        : '/api/past-events';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          category: eventCategory,
          year: eventYear,
          description: eventDescription,
        }),
      });

      if (!res.ok) throw new Error('Failed to save event');
      await fetchEvents();
      toast.success(editingEventId ? 'Event updated' : 'Event created');
      closeEventModal();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddMedia() {
    if (!selectedEventId || !mediaUrl) {
      toast.error('Media URL is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/past-events/${selectedEventId}/media`, {
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
      await fetchEvents();
      toast.success('Media added');
      closeMediaModal();
    } catch (error) {
      toast.error('Failed to add media');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateMedia() {
    if (!selectedEventId || !editingMediaId) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/past-events/${selectedEventId}/media`, {
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
      await fetchEvents();
      toast.success('Media updated');
      closeMediaModal();
    } catch (error) {
      toast.error('Failed to update media');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteEvent() {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/past-events/${deleteConfirm}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      await fetchEvents();
      toast.success('Event deleted');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteMedia() {
    if (!deleteMediaConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/past-events/${deleteMediaConfirm.eventId}/media?mediaId=${deleteMediaConfirm.mediaId}`,
        { method: 'DELETE' }
      );

      if (!res.ok) throw new Error('Failed to delete');
      await fetchEvents();
      toast.success('Media deleted');
      setDeleteMediaConfirm(null);
    } catch (error) {
      toast.error('Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  }

  function openEditEventModal(event: PastEvent) {
    setEditingEventId(event._id);
    setEventTitle(event.title);
    setEventCategory(event.category);
    setEventYear(event.year);
    setEventDescription(event.description);
    setIsEventModalOpen(true);
  }

  function openAddEventModal() {
    setEditingEventId(null);
    setEventTitle('');
    setEventCategory('');
    setEventYear('');
    setEventDescription('');
    setIsEventModalOpen(true);
  }

  function closeEventModal() {
    setEditingEventId(null);
    setEventTitle('');
    setEventCategory('');
    setEventYear('');
    setEventDescription('');
    setIsEventModalOpen(false);
  }

  function openAddMediaModal(eventId: string) {
    setSelectedEventId(eventId);
    setEditingMediaId(null);
    setMediaType('image');
    setMediaUrl('');
    setPosterUrl('');
    setCaption('');
    setIsMediaModalOpen(true);
  }

  function openEditMediaModal(eventId: string, media: EventMedia) {
    setSelectedEventId(eventId);
    setEditingMediaId(media._id);
    setMediaType((media.mediaType || 'image') as MediaType);
    setMediaUrl(media.imageUrl);
    setPosterUrl(media.posterUrl || '');
    setCaption(media.caption || '');
    setIsMediaModalOpen(true);
  }

  function closeMediaModal() {
    setSelectedEventId(null);
    setEditingMediaId(null);
    setMediaType('image');
    setMediaUrl('');
    setPosterUrl('');
    setCaption('');
    setIsMediaModalOpen(false);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
            Gallery management
          </p>
          <h1 className="mt-4 font-serif text-4xl text-white/92 sm:text-5xl">
            Past Events ({events.length})
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
            Build the past events gallery. Add events, upload multiple images and videos for each, and manage visibility.
          </p>
        </div>
        <AdminButton onClick={openAddEventModal} variant="primary">
          <Plus size={18} className="mr-2 inline" />
          Add Event
        </AdminButton>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-white/10 border-dashed bg-white/5 px-6 py-12 text-center">
          <p className="text-sm text-white/55">
            No past events yet. Create your first event to start building the gallery.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-white">{event.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                      {event.category}
                    </span>
                    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                      {event.year}
                    </span>
                    {!event.isActive && (
                      <span className="inline-block rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-red-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-3 text-sm text-white/60">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditEventModal(event)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white transition hover:border-teal-300/40 hover:bg-white/10"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(event._id)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white transition hover:border-red-300/40 hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white/75">
                    Media ({event.media.length})
                  </h4>
                  <AdminButton
                    onClick={() => openAddMediaModal(event._id)}
                    variant="secondary"
                  >
                    <Plus size={14} className="mr-1 inline" />
                    Add Media
                  </AdminButton>
                </div>

                {event.media.length === 0 ? (
                  <div className="rounded-lg border border-white/10 border-dashed bg-black/20 px-4 py-6 text-center">
                    <p className="text-xs text-white/45">No media yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {event.media.map((media) => (
                      <div
                        key={media._id}
                        className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30"
                      >
                        <div className="aspect-square w-full overflow-hidden">
                          {media.mediaType === 'video' ? (
                            <video
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              poster={media.posterUrl || undefined}
                            >
                              <source src={media.imageUrl} />
                            </video>
                          ) : (
                            <img
                              src={media.imageUrl}
                              alt={media.caption || 'Event media'}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                        {media.mediaType === 'video' && (
                          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                            <Film size={10} />
                            <span>Video</span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => openEditMediaModal(event._id, media)}
                            className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteMediaConfirm({
                                eventId: event._id,
                                mediaId: media._id,
                              })
                            }
                            className="rounded-lg bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/40"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      <AdminModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        title={editingEventId ? 'Edit Event' : 'Add New Event'}
        size="md"
      >
        <div className="space-y-6">
          <AdminInput
            label="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="e.g., Golden Table Dinner"
            required
          />
          <AdminInput
            label="Category"
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
            placeholder="e.g., Hospitality / Dining"
            required
          />
          <AdminInput
            label="Year"
            value={eventYear}
            onChange={(e) => setEventYear(e.target.value)}
            placeholder="e.g., 2025"
            required
          />
          <AdminTextarea
            label="Description (optional)"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Add event details..."
            rows={3}
          />

          <div className="flex gap-4">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={closeEventModal}
              disabled={isSubmitting}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              onClick={handleSaveEvent}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Media Modal */}
      <AdminModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaModal}
        title={editingMediaId ? 'Edit Media' : 'Add Media'}
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

          <AdminInput
            label="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe the media"
          />

          <div className="flex gap-4">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={closeMediaModal}
              disabled={isSubmitting}
            >
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

      {/* Delete Event Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Event"
        message="Are you sure you want to delete this event and all its media? This action cannot be undone."
        onConfirm={handleDeleteEvent}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />

      {/* Delete Media Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteMediaConfirm}
        title="Delete Media"
        message="Are you sure you want to delete this media? This action cannot be undone."
        onConfirm={handleDeleteMedia}
        onCancel={() => setDeleteMediaConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
