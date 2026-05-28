'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import AdminModal from '@/components/admin/AdminModal';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

const JobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Type is required'),
  overview: z.string().min(1, 'Overview is required'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  order: z.number().optional(),
});

type JobPostingForm = z.infer<typeof JobPostingSchema>;

export default function JobPostingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<JobPostingForm>({
    resolver: zodResolver(JobPostingSchema),
  });

  const responsibilities = watch('responsibilities') ?? [];
  const requirements = watch('requirements') ?? [];

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/job-postings');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch job postings');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: JobPostingForm) {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/job-postings/${editingId}`
        : '/api/job-postings';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save job posting');
      }

      toast.success(editingId ? 'Job posting updated' : 'Job posting created');
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      setResponsibilitiesInput('');
      setRequirementsInput('');
      await fetchItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  }

  function openEdit(item: any) {
    setEditingId(item._id);
    setValue('title', item.title);
    setValue('company', item.company);
    setValue('location', item.location);
    setValue('type', item.type);
    setValue('overview', item.overview);
    setValue('responsibilities', item.responsibilities || []);
    setValue('requirements', item.requirements || []);
    setValue('order', item.order || 0);
    setResponsibilitiesInput(item.responsibilities?.join('\n') || '');
    setRequirementsInput(item.requirements?.join('\n') || '');
    setIsModalOpen(true);
  }

  function addResponsibility() {
    if (responsibilitiesInput.trim()) {
      const current = watch('responsibilities') || [];
      setValue('responsibilities', [...current, responsibilitiesInput.trim()]);
      setResponsibilitiesInput('');
    }
  }

  function removeResponsibility(index: number) {
    const current = watch('responsibilities') || [];
    setValue('responsibilities', current.filter((_, i) => i !== index));
  }

  function addRequirement() {
    if (requirementsInput.trim()) {
      const current = watch('requirements') || [];
      setValue('requirements', [...current, requirementsInput.trim()]);
      setRequirementsInput('');
    }
  }

  function removeRequirement(index: number) {
    const current = watch('requirements') || [];
    setValue('requirements', current.filter((_, i) => i !== index));
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/job-postings/${deleteConfirm}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Job posting deleted');
      setDeleteConfirm(null);
      await fetchItems();
    } catch (error) {
      toast.error('Failed to delete job posting');
    } finally {
      setIsDeleting(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
    setResponsibilitiesInput('');
    setRequirementsInput('');
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-white/90">Job Postings</h1>
          <p className="text-white/50 mt-1 md:mt-2 text-sm md:text-base">Manage career opportunities</p>
        </div>
        <AdminButton
          onClick={() => {
            reset();
            setEditingId(null);
            setResponsibilitiesInput('');
            setRequirementsInput('');
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus size={18} className="inline mr-2" />
          Add Job Posting
        </AdminButton>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50">No job postings yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-[1.2rem] p-4 md:p-6 flex justify-between items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-white/90 font-semibold text-base md:text-lg">{item.title}</h3>
                <p className="text-white/60 text-xs md:text-sm mt-1 flex flex-wrap gap-x-1">
                  <span>{item.company}</span>
                  <span className="text-white/30">•</span>
                  <span>{item.location}</span>
                  <span className="text-white/30">•</span>
                  <span>{item.type}</span>
                </p>
                <p className="text-white/50 text-sm mt-2 line-clamp-2">{item.overview}</p>
              </div>
              <div className="flex gap-1 md:gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item._id)}
                  className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Job Posting' : 'Add Job Posting'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AdminInput
            label="Job Title"
            {...register('title')}
            error={errors.title?.message}
            required
          />

          <AdminInput
            label="Company"
            {...register('company')}
            error={errors.company?.message}
            required
          />

          <AdminInput
            label="Location"
            {...register('location')}
            error={errors.location?.message}
            required
          />

          <AdminInput
            label="Type"
            {...register('type')}
            placeholder="e.g., Full-time, Contract, Part-time"
            error={errors.type?.message}
            required
          />

          <AdminTextarea
            label="Overview"
            {...register('overview')}
            error={errors.overview?.message}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Responsibilities
            </label>
            <div className="space-y-2">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                  <span className="flex-1 text-white/80 text-sm">{resp}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsibility(idx)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                  placeholder="Add responsibility and press Enter"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none focus:border-teal-300/50"
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-3 py-2 bg-teal-300/20 text-teal-300 rounded-lg text-sm hover:bg-teal-300/30 transition"
                >
                  Add
                </button>
              </div>
              {errors.responsibilities && (
                <p className="text-red-400 text-xs mt-1">{errors.responsibilities.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Requirements
            </label>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                  <span className="flex-1 text-white/80 text-sm">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  placeholder="Add requirement and press Enter"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none focus:border-teal-300/50"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-3 py-2 bg-teal-300/20 text-teal-300 rounded-lg text-sm hover:bg-teal-300/30 transition"
                >
                  Add
                </button>
              </div>
              {errors.requirements && (
                <p className="text-red-400 text-xs mt-1">{errors.requirements.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <AdminButton type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" className="flex-1">
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
