'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Trash2, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import AdminButton from '@/components/admin/AdminButton';
import AdminModal from '@/components/admin/AdminModal';
import AdminTable from '@/components/admin/AdminTable';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

const PAGE_SIZE = 20;

function Detail({ label, value }: { label: string; value?: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div>
      <p className="text-xs uppercase text-white/40 tracking-widest mb-1">{label}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((v, i) => (
            <span key={i} className="px-3 py-1 bg-teal-300/12 text-teal-200 rounded-full text-sm">{v}</span>
          ))}
        </div>
      ) : (
        <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{value}</p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const hasContent = Array.isArray(children)
    ? (children as any[]).some(Boolean)
    : !!children;
  if (!hasContent) return null;
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <p className="text-[0.6rem] uppercase tracking-[0.28em] text-teal-300/60 mb-4">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function QuestionnairePage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [selected, setSelected]       = useState<any | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  useEffect(() => { fetch_(page); }, [page]);

  async function fetch_(p = 1) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/questionnaire?page=${p}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setPage(data.page || p);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load questionnaire submissions');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/questionnaire/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Submission deleted');
      setDeleteId(null);
      await fetch_(page);
    } catch {
      toast.error('Failed to delete submission');
    } finally {
      setIsDeleting(false);
    }
  }

  const columns = [
    { key: 'fullName', label: 'Name', sortable: true },
    { key: 'email',    label: 'Email' },
    { key: 'company',  label: 'Organization', sortable: true },
    { key: 'eventName', label: 'Event', render: (_: any, row: any) => row.eventName || '—' },
    { key: 'eventDate', label: 'Date', render: (_: any, row: any) => row.eventDate || '—' },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (_: any, row: any) =>
        new Date(row.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button onClick={() => setSelected(row)} className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition">
            <Eye size={16} />
          </button>
          <button onClick={() => setDeleteId(row._id)} className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl sm:text-4xl text-white/90">Event Questionnaires</h1>
        <p className="text-white/50 mt-1 md:mt-2 text-sm md:text-base">
          Event Logistics & Operations Discovery responses
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : submissions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40 text-sm">No questionnaire submissions yet</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[1.8rem] p-4 md:p-6 backdrop-blur-sm">
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {submissions.map(row => (
              <div key={row._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 font-medium truncate">{row.fullName}</p>
                    <p className="text-teal-300/80 text-xs mt-0.5 truncate">{row.email}</p>
                    <p className="text-white/55 text-xs mt-1">{row.company}</p>
                    {row.eventName && <p className="text-white/40 text-xs mt-1 italic">{row.eventName}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setSelected(row)} className="p-2 hover:bg-teal-300/20 text-teal-300 rounded-lg transition">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => setDeleteId(row._id)} className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <AdminTable columns={columns} data={submissions} />
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/50">
              {total === 0
                ? 'No submissions'
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
            </p>
            <div className="flex items-center gap-2">
              <AdminButton variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={isLoading || page <= 1} className="px-4! py-2! flex items-center gap-2">
                <ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span>
              </AdminButton>
              <span className="text-sm text-white/60 px-1">{page} / {Math.max(1, totalPages)}</span>
              <AdminButton variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={isLoading || page >= totalPages} className="px-4! py-2! flex items-center gap-2">
                <span className="hidden sm:inline">Next</span><ChevronRight size={16} />
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AdminModal isOpen={!!selected} onClose={() => setSelected(null)} title="Questionnaire Submission">
        {selected && (
          <div className="space-y-4">
            <Section title="Contact Details">
              <Detail label="Full Name" value={selected.fullName} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Organization" value={selected.company} />
            </Section>

            <Section title="Event Overview">
              <Detail label="Event Name & Purpose" value={selected.eventName} />
              <Detail label="Objectives & Success Metrics" value={selected.objectives} />
              <Detail label="Event Date(s)" value={selected.eventDate} />
              <Detail label="City & Venue" value={selected.cityVenue} />
              <Detail label="Format" value={selected.eventFormat} />
              <Detail label="Attendee Count" value={selected.attendeeCount} />
              <Detail label="Target Audience" value={selected.targetAudience} />
            </Section>

            <Section title="Scope of Support">
              <Detail label="Responsibilities" value={selected.responsibilities} />
              <Detail label="Managing Scope" value={selected.managingScope} />
              <Detail label="Existing Vendors" value={selected.existingVendors} />
              <Detail label="Vendor Details" value={selected.existingVendorDetails} />
              <Detail label="Internal Team" value={selected.internalTeam} />
              <Detail label="Team Details" value={selected.internalTeamDetails} />
            </Section>

            <Section title="Venue & Production">
              <Detail label="Venue Secured" value={selected.venueSecured} />
              <Detail label="Venue Preferences" value={selected.venuePreferences} />
              <Detail label="Required Spaces" value={selected.requiredSpaces} />
              <Detail label="Production Needs" value={selected.productionNeeds} />
              <Detail label="Special Production" value={selected.specialProduction} />
            </Section>

            <Section title="Guest Experience & Speakers">
              <Detail label="Registration Method" value={selected.registrationMethod} />
              <Detail label="Ticketing Support" value={selected.ticketingSupport} />
              <Detail label="VIPs / Special Guests" value={selected.vipGuests} />
              <Detail label="VIP Details" value={selected.vipDetails} />
              <Detail label="Accessibility" value={selected.accessibilityRequired} />
              <Detail label="Accessibility Details" value={selected.accessibilityDetails} />
              <Detail label="Guest Touchpoints" value={selected.guestTouchpoints} />
              <Detail label="Speaker Count" value={selected.speakerCount} />
              <Detail label="Travel Coordination" value={selected.travelCoordination} />
              <Detail label="Speaker Management" value={selected.speakerManagement} />
            </Section>

            <Section title="Operations">
              <Detail label="Staffing Required" value={selected.staffingRequired} />
              <Detail label="Volunteers" value={selected.volunteersNeeded} />
              <Detail label="Staffing Recruitment" value={selected.staffingRecruitment} />
              <Detail label="Catering" value={selected.cateringProvided} />
              <Detail label="Service Style" value={selected.serviceStyle} />
              <Detail label="Dietary Requirements" value={selected.dietaryRequirements} />
              <Detail label="Attendee Communications" value={selected.attendeeCommunications} />
              <Detail label="Marketing Management" value={selected.marketingManagement} />
              <Detail label="Event Materials" value={selected.eventMaterials} />
            </Section>

            <Section title="Logistics & Risk">
              <Detail label="Transportation" value={selected.transportationRequired} />
              <Detail label="Hotel Blocks" value={selected.hotelBlocks} />
              <Detail label="Airport Transfers" value={selected.airportTransfers} />
              <Detail label="Sponsors Involved" value={selected.sponsorsInvolved} />
              <Detail label="Sponsor Deliverables" value={selected.sponsorDeliverables} />
              <Detail label="Exhibitor Activations" value={selected.exhibitorActivations} />
              <Detail label="Event Insurance" value={selected.eventInsurance} />
              <Detail label="Permits Required" value={selected.permitsRequired} />
              <Detail label="Security Required" value={selected.securityRequired} />
              <Detail label="Contingency Plans" value={selected.contingencyPlans} />
            </Section>

            <Section title="Budget & Timeline">
              <Detail label="Budget Range" value={selected.budgetRange} />
              <Detail label="Budget Constraints" value={selected.budgetConstraints} />
              <Detail label="Decision Makers" value={selected.decisionMakers} />
              <Detail label="Procurement Process" value={selected.procurementProcess} />
              <Detail label="Planning Start" value={selected.planningStart} />
              <Detail label="Major Milestones" value={selected.majorMilestones} />
              <Detail label="Post-Event Reporting" value={selected.postEventReporting} />
              <Detail label="Success Definition" value={selected.successDefinition} />
            </Section>

            <div className="pt-2">
              <AdminButton onClick={() => window.open(`mailto:${selected.email}?subject=Re: Your RÌNWÁ Event Questionnaire`)} variant="primary" className="w-full">
                <Mail size={17} className="inline mr-2" />
                Reply via Email
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        title="Delete Questionnaire"
        message="Are you sure you want to delete this questionnaire submission? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
