import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  UserView,
  TicketStatus,
  TicketCategory,
} from './types.ts';
import {
  INITIAL_TICKETS,
  calculateStats,
  createTicket,
  updateTicketStatus,
  filterTickets,
  loadStoredTickets,
  saveStoredTickets,
  CreateTicketParams,
} from './utils/ticketLogic.ts';
import { Header } from './components/Header.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { TicketCard } from './components/TicketCard.tsx';
import { TicketForm } from './components/TicketForm.tsx';
import { MaintenanceTools } from './components/MaintenanceTools.tsx';
import { PhotoModal } from './components/PhotoModal.tsx';
import { Search, Filter, X, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => loadStoredTickets());
  const [view, setView] = useState<UserView>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Photo Lightbox state
  const [activePhoto, setActivePhoto] = useState<{ url: string; title: string } | null>(null);

  // Modal to log technician work order from maintenance view
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);

  // Persist tickets whenever changed
  useEffect(() => {
    saveStoredTickets(tickets);
  }, [tickets]);

  // Handle URL query parameter `?view=maintenance` or `?view=student`
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'maintenance' || viewParam === 'student') {
      setView(viewParam);
    }
  }, []);

  const stats = useMemo(() => calculateStats(tickets), [tickets]);

  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, {
      search: searchQuery,
      status: statusFilter,
      category: categoryFilter,
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  const handleCreateTicket = (params: CreateTicketParams) => {
    try {
      const newTicket = createTicket(tickets, params);
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      setNoticeMessage(
        `Ticket #${newTicket.id} created successfully. The maintenance team can now view it.`
      );
      // Auto-clear notice after 6 seconds
      setTimeout(() => {
        setNoticeMessage(null);
      }, 6000);
      setShowTechnicianModal(false);
    } catch (err: any) {
      setNoticeMessage(err.message || 'Error creating ticket');
    }
  };

  const handleUpdateStatus = (ticketId: number, nextStatus: TicketStatus, note?: string) => {
    const actor = view === 'student' ? 'Student' : 'Maintenance';
    const updated = updateTicketStatus(tickets, ticketId, nextStatus, actor, note);
    setTickets(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tickets to original demo sample tickets?')) {
      setTickets(INITIAL_TICKETS);
      setStatusFilter('all');
      setCategoryFilter('all');
      setSearchQuery('');
      setNoticeMessage('Reset tickets to sample defaults.');
    }
  };

  return (
    <div className="app min-h-screen bg-[#f3f7f5] text-[#172b26] flex flex-col font-sans">
      {/* Header */}
      <Header
        currentView={view}
        onViewChange={(newView) => {
          setView(newView);
        }}
        onResetData={handleResetData}
      />

      {/* Main Content */}
      <main className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Eyebrow & Hero Title */}
        <div className="eyebrow text-[#438171] uppercase text-[11px] tracking-[1.8px] font-extrabold mb-1">
          Campus maintenance portal
        </div>

        <h1
          id="pageTitle"
          className="text-3xl sm:text-4xl lg:text-[39px] font-extrabold tracking-tight text-[#172b26] my-2 leading-tight"
        >
          {view === 'student'
            ? 'Good day. What needs fixing?'
            : 'Maintenance team dashboard'}
        </h1>

        <p id="pageSub" className="sub text-[#62746e] text-base mb-6">
          {view === 'student'
            ? 'Raise a maintenance request and follow its progress from one place.'
            : 'Review campus requests and update each ticket as work progresses.'}
        </p>

        {/* Stats Row */}
        <StatsCards
          stats={stats}
          selectedStatusFilter={statusFilter}
          onSelectFilter={(status) => setStatusFilter(status)}
        />

        {/* 2-Column Responsive Layout */}
        <div className="layout grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-5 items-start mt-4">
          {/* Left Panel: Tickets List */}
          <section className="panel bg-white border border-[#e1ebe6] rounded-[17px] p-5 shadow-[0_6px_22px_rgba(23,76,66,0.04)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#eef3f1]">
              <div className="flex items-center gap-2">
                <h2 id="listTitle" className="text-lg font-bold text-[#172b26] m-0">
                  {view === 'student' ? 'Your recent tickets' : 'All campus tickets'}
                </h2>
                <span className="text-xs font-semibold text-[#52645d] bg-[#f0f5f3] px-2 py-0.5 rounded-full">
                  {filteredTickets.length}
                </span>
              </div>

              {/* Status filter tabs for quick toggle */}
              <div className="flex items-center gap-1 bg-[#f0f5f3] p-1 rounded-lg text-xs self-stretch sm:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-[#174c42] shadow-xs'
                      : 'text-[#62746e] hover:text-[#172b26]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Open')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    statusFilter === 'Open'
                      ? 'bg-amber-100 text-[#96611a] shadow-xs'
                      : 'text-[#62746e] hover:text-amber-800'
                  }`}
                >
                  Open ({stats.open})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Resolved')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    statusFilter === 'Resolved'
                      ? 'bg-emerald-100 text-[#21815f] shadow-xs'
                      : 'text-[#62746e] hover:text-emerald-800'
                  }`}
                >
                  Resolved ({stats.resolved})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Acknowledged')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    statusFilter === 'Acknowledged'
                      ? 'bg-blue-100 text-[#3679a8] shadow-xs'
                      : 'text-[#62746e] hover:text-blue-800'
                  }`}
                >
                  Closed ({stats.acknowledged})
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#71817b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by ticket #, title, or room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs border border-[#dce7e1] rounded-lg bg-[#fbfdfc] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42]"
                  aria-label="Search tickets"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71817b] hover:text-[#172b26]"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category filter dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#dce7e1] rounded-lg bg-[#fbfdfc] text-[#19332c] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42]"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Computer / Network">Computer / Network</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>

                {(categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('all');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#52645d] hover:text-[#174c42] whitespace-nowrap underline cursor-pointer px-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Tickets Stream Container */}
            <div id="tickets">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    userView={view}
                    onUpdateStatus={handleUpdateStatus}
                    onViewPhoto={(url, title) => setActivePhoto({ url, title })}
                  />
                ))
              ) : (
                <div className="empty p-8 text-center text-[#73827d] bg-[#f9fbfa] rounded-[14px] border border-dashed border-[#dce7e1]">
                  <p className="font-semibold text-sm text-[#52645d] mb-1">
                    No tickets found
                  </p>
                  <p className="text-xs text-[#71817b] mb-3">
                    {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                      ? 'No tickets match the selected filters.'
                      : 'No tickets yet. Raise your first complaint.'}
                  </p>
                  {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter('all');
                        setStatusFilter('all');
                        setSearchQuery('');
                      }}
                      className="text-xs px-3 py-1.5 bg-[#e8f2ee] text-[#245447] font-semibold rounded-lg hover:bg-[#d8e8e1]"
                    >
                      Clear active filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Right Panel: Student Form or Maintenance Hub */}
          {view === 'student' ? (
            <TicketForm
              onSubmitTicket={handleCreateTicket}
              noticeMessage={noticeMessage}
            />
          ) : (
            <MaintenanceTools
              tickets={tickets}
              stats={stats}
              selectedCategory={categoryFilter}
              onFilterCategory={(cat) => setCategoryFilter(cat)}
              onOpenNewTicketModal={() => setShowTechnicianModal(true)}
            />
          )}
        </div>
      </main>

      {/* Technician New Ticket Modal (in Maintenance view) */}
      {showTechnicianModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowTechnicianModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl border border-[#dce7e1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#172b26]">
                Log Technician Work Order
              </h3>
              <button
                type="button"
                onClick={() => setShowTechnicianModal(false)}
                className="text-[#71817b] hover:text-[#172b26] p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TicketForm
              onSubmitTicket={handleCreateTicket}
              noticeMessage={noticeMessage}
            />
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      <PhotoModal
        isOpen={!!activePhoto}
        photoUrl={activePhoto?.url || null}
        title={activePhoto?.title || null}
        onClose={() => setActivePhoto(null)}
      />

      {/* Footer */}
      <footer className="text-center text-[#809089] text-xs py-6 mt-auto border-t border-[#e8f0ec]">
        FixIt · A simple way to keep your campus running smoothly
      </footer>
    </div>
  );
}
