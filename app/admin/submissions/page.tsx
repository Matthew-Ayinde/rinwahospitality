'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Trash2, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminModal from '@/components/admin/AdminModal';
import AdminTable from '@/components/admin/AdminTable';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

const PAGE_SIZE = 20;

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  async function fetchSubmissions(page = 1) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/submissions?page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
      setTotalSubmissions(data.total || 0);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/submissions/${deleteConfirm}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Submission deleted');
      setDeleteConfirm(null);
      await fetchSubmissions(currentPage);
    } catch (error) {
      toast.error('Failed to delete submission');
    } finally {
      setIsDeleting(false);
    }
  }

  const columns = [
    { key: 'fullName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company', sortable: true },
    {
      key: 'industry',
      label: 'Industry',
      render: (_: any, row: any) => (row.industries?.length ? row.industries.join(', ') : row.industry || '—'),
    },
    {
      key: 'feelings',
      label: 'Feelings',
      render: (_: any, row: any) => (row.feelings?.length ? row.feelings.slice(0, 2).join(' · ') : '—'),
    },
    {
      key: 'estimatedBudget',
      label: 'Budget',
      render: (_: any, row: any) => {
        const symbols: Record<string, string> = { NGN: '₦', USD: '$', CAD: 'CA$', GBP: '£', EUR: '€' };
        const sym = symbols[row.currency] ?? '₦';
        return `${sym}${row.estimatedBudget?.toLocaleString()}`;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedSubmission(row)}
            className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition"
          >
            <Eye size={16} />
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl sm:text-4xl text-white/90">Form Submissions</h1>
        <p className="text-white/50 mt-1 md:mt-2 text-sm md:text-base">View and manage contact form submissions</p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50">No submissions yet</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[1.8rem] p-4 md:p-6 backdrop-blur-sm">
          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {submissions.map((row) => {
              const symbols: Record<string, string> = { NGN: '₦', USD: '$', CAD: 'CA$', GBP: '£', EUR: '€' };
              const sym = symbols[row.currency] ?? '₦';
              return (
                <div key={row._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-medium truncate">{row.fullName}</p>
                      <p className="text-teal-300/80 text-xs mt-0.5 truncate">{row.email}</p>
                      <p className="text-white/60 text-xs mt-1">{row.company}</p>
                      <p className="text-white/40 text-xs mt-1">{`${sym}${row.estimatedBudget?.toLocaleString()}`}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setSelectedSubmission(row)}
                        className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(row._id)}
                        className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <AdminTable columns={columns} data={submissions} />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/50">
              {totalSubmissions === 0
                ? 'No submissions to display'
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, totalSubmissions)} of ${totalSubmissions}`}
            </p>

            <div className="flex items-center gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={isLoading || currentPage <= 1}
                className="px-4! py-2! flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </AdminButton>
              <span className="text-sm text-white/60 px-1">
                {currentPage} / {Math.max(1, totalPages)}
              </span>
              <AdminButton
                variant="secondary"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={isLoading || currentPage >= totalPages}
                className="px-4! py-2! flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AdminModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="Submission Details"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Full Name</p>
              <p className="text-white/90">{selectedSubmission.fullName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Email</p>
              <a href={`mailto:${selectedSubmission.email}`} className="text-teal-300 hover:text-teal-200">
                {selectedSubmission.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Phone</p>
              <p className="text-white/90">{selectedSubmission.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Company</p>
              <p className="text-white/90">{selectedSubmission.company}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Industry</p>
              <div className="flex flex-wrap gap-2">
                {(selectedSubmission.industries?.length
                  ? selectedSubmission.industries
                  : selectedSubmission.industry
                    ? [selectedSubmission.industry]
                    : []
                ).map((item: string) => (
                  <span key={item} className="px-3 py-1 bg-teal-300/15 text-teal-200 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {selectedSubmission.feelings && selectedSubmission.feelings.length > 0 && (
              <div>
                <p className="text-xs uppercase text-white/50 tracking-widest mb-2">Feelings</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.feelings.map((feeling: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-teal-300/15 text-teal-200 rounded-full text-sm">
                      {feeling}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Project Date</p>
              <p className="text-white/90">{selectedSubmission.projectDate}</p>
            </div>
            {selectedSubmission.location && (
              <div>
                <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Location</p>
                <p className="text-white/90">{selectedSubmission.location}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Budget</p>
              <p className="text-white/90">
                {({ NGN: '₦', USD: '$', CAD: 'CA$', GBP: '£', EUR: '€' } as Record<string, string>)[selectedSubmission.currency] ?? '₦'}
                {selectedSubmission.estimatedBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/50 tracking-widest mb-1">Description</p>
              <p className="text-white/90">{selectedSubmission.description}</p>
            </div>
            {selectedSubmission.goals && selectedSubmission.goals.length > 0 && (
              <div>
                <p className="text-xs uppercase text-white/50 tracking-widest mb-2">Goals</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.goals.map((goal: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-teal-300/15 text-teal-200 rounded-full text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <AdminButton
                onClick={() => window.open(`mailto:${selectedSubmission.email}`)}
                variant="primary"
                className="w-full"
              >
                <Mail size={18} className="inline mr-2" />
                Reply via Email
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
