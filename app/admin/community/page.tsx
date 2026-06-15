'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Download, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminTable from '@/components/admin/AdminTable';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

const PAGE_SIZE = 20;

export default function CommunityPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMembers = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/community?page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMembers(data.members || []);
      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to fetch community members');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage, fetchMembers]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/community/${deleteConfirm}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Member removed');
      setDeleteConfirm(null);
      await fetchMembers(currentPage);
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleExport() {
    try {
      setIsExporting(true);
      const res = await fetch('/api/community/export');
      if (!res.ok) throw new Error('Failed to export');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `rinwa-community-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch {
      toast.error('Failed to export members');
    } finally {
      setIsExporting(false);
    }
  }

  const columns = [
    { key: 'email', label: 'Email' },
    {
      key: 'firstName',
      label: 'First Name',
      render: (_: any, row: any) => row.firstName || <span className="text-white/30">—</span>,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (_: any, row: any) =>
        new Date(row.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <button
          onClick={() => setDeleteConfirm(row._id)}
          className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
          aria-label="Remove member"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-white/90">Community</h1>
          <p className="text-white/50 mt-1 md:mt-2 text-sm md:text-base">
            {total > 0 ? `${total.toLocaleString()} member${total !== 1 ? 's' : ''}` : 'No members yet'}
          </p>
        </div>

        {total > 0 && (
          <AdminButton
            variant="secondary"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 self-start"
          >
            <Download size={16} />
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </AdminButton>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5">
            <Users size={24} className="text-white/30" />
          </div>
          <p className="text-white/50">No community members yet.</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[1.8rem] p-4 md:p-6 backdrop-blur-sm">
          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {members.map((row) => (
              <div key={row._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {row.firstName && (
                      <p className="text-white/90 font-medium truncate">{row.firstName}</p>
                    )}
                    <p className="text-teal-300/80 text-sm truncate">{row.email}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(row.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(row._id)}
                    className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition flex-shrink-0"
                    aria-label="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <AdminTable columns={columns} data={members} />
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/50">
              {total === 0
                ? 'No members to display'
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, total)} of ${total}`}
            </p>

            <div className="flex items-center gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Remove Member"
        message="Are you sure you want to remove this member from the community? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
