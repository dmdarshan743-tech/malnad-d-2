import React, { useState } from 'react';
import { Ticket, TicketStatus, UserView } from '../types.ts';
import {
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  History,
  Image as ImageIcon,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  userView: UserView;
  onUpdateStatus: (ticketId: number, status: TicketStatus, note?: string) => void;
  onViewPhoto?: (url: string, title: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  userView,
  onUpdateStatus,
  onViewPhoto,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');

  const statusClass =
    ticket.status === 'Open'
      ? 'bg-[#fff1d9] text-[#96611a]'
      : ticket.status === 'Resolved'
      ? 'bg-[#e2f5eb] text-[#24714c]'
      : 'bg-[#e6efff] text-[#315d9c]';

  const priorityColors = {
    Low: 'text-slate-600 bg-slate-100',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    High: 'text-orange-700 bg-orange-50 border-orange-200',
    Emergency: 'text-red-700 bg-red-100/80 border-red-300 font-bold animate-pulse',
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(ticket.id, 'Resolved', resolutionNoteInput.trim() || undefined);
    setIsResolving(false);
    setResolutionNoteInput('');
  };

  return (
    <article
      className="ticket bg-white border border-[#e1ebe6] rounded-[17px] p-4.5 mb-3 transition-all hover:border-[#cbd8d2] shadow-sm hover:shadow"
      data-testid={`ticket-${ticket.id}`}
      data-status={ticket.status.toLowerCase()}
    >
      <div className="ticket-top flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-[#172b26] m-0 tracking-tight">
              #{ticket.id} · {ticket.title}
            </h3>
            {ticket.priority && ticket.priority !== 'Medium' && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  priorityColors[ticket.priority] || ''
                }`}
              >
                {ticket.priority} Priority
              </span>
            )}
          </div>

          <div className="text-[13px] text-[#71817b] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-1 font-medium text-[#2d4941]">
              <Tag className="w-3.5 h-3.5 text-[#548b7d]" />
              {ticket.category}
            </span>
            <span aria-hidden="true" className="text-[#a4b6af]">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#71817b]" />
              {ticket.location}
            </span>
            <span aria-hidden="true" className="text-[#a4b6af]">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#71817b]" />
              {ticket.date}
            </span>
          </div>
        </div>

        <span
          className={`badge ${ticket.status.toLowerCase()} text-[11px] font-extrabold px-2.5 py-1.5 rounded-full whitespace-nowrap self-start shrink-0 ${statusClass}`}
        >
          {ticket.status}
        </span>
      </div>

      <p className="text-[13.5px] text-[#4b5e57] leading-relaxed my-2 whitespace-pre-wrap">
        {ticket.description}
      </p>

      {/* Optional Photo Attachment */}
      {ticket.photo && (
        <div className="my-2.5">
          <button
            type="button"
            onClick={() => onViewPhoto && onViewPhoto(ticket.photo!, ticket.title)}
            className="group flex items-center gap-2 p-1.5 pr-3 bg-[#f5faf8] border border-[#dce7e1] rounded-xl hover:border-[#174c42] transition-colors text-left"
          >
            <img
              src={ticket.photo}
              alt={`Attachment for ticket #${ticket.id}`}
              className="w-12 h-12 rounded-lg object-cover border border-[#e1ebe6]"
            />
            <div>
              <span className="text-xs font-semibold text-[#174c42] group-hover:underline flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                View attached photo
              </span>
              <span className="text-[11px] text-[#71817b] block">Click to enlarge</span>
            </div>
          </button>
        </div>
      )}

      {/* Resolution Note Banner */}
      {ticket.resolutionNote && (
        <div className="mt-2.5 p-2.5 bg-[#f0f9f5] border border-[#cbe8dc] rounded-xl text-xs text-[#1e5244] flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#21815f] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Maintenance Resolution: </span>
            <span>{ticket.resolutionNote}</span>
          </div>
        </div>
      )}

      {/* Resolve Note Input Modal/Form (in Maintenance View) */}
      {isResolving && (
        <form onSubmit={handleResolveSubmit} className="mt-3 p-3 bg-[#f8fbfa] border border-[#cbe8dc] rounded-xl space-y-2">
          <label htmlFor={`res-note-${ticket.id}`} className="block text-xs font-bold text-[#173b34]">
            Resolution notes or parts replaced (optional):
          </label>
          <input
            id={`res-note-${ticket.id}`}
            type="text"
            value={resolutionNoteInput}
            onChange={(e) => setResolutionNoteInput(e.target.value)}
            placeholder="e.g. Replaced faulty switch, tested okay"
            className="w-full text-xs px-3 py-2 border border-[#dce7e1] rounded-lg bg-white"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 bg-[#174c42] text-white rounded-lg hover:bg-[#1f5f53]"
            >
              Confirm Resolved
            </button>
            <button
              type="button"
              onClick={() => setIsResolving(false)}
              className="text-xs font-semibold px-3 py-1.5 bg-[#e8f2ee] text-[#245447] rounded-lg hover:bg-[#d8e8e1]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Action Buttons */}
      <div className="actions flex items-center justify-between gap-2 flex-wrap mt-3 pt-2 border-t border-[#f0f4f2]">
        <div className="flex items-center gap-2">
          {/* Maintenance Actions */}
          {userView === 'maintenance' && (
            <>
              {ticket.status === 'Open' && (
                <button
                  type="button"
                  onClick={() => setIsResolving(true)}
                  className="primary text-xs font-semibold px-3 py-1.5 bg-[#174c42] text-white rounded-lg hover:bg-[#1f5f53] transition-colors"
                >
                  Mark resolved
                </button>
              )}
              {ticket.status === 'Resolved' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(ticket.id, 'Acknowledged')}
                  className="secondary text-xs font-semibold px-3 py-1.5 bg-[#e8f2ee] text-[#245447] rounded-lg hover:bg-[#d8e8e1] transition-colors"
                >
                  Close / acknowledge
                </button>
              )}
            </>
          )}

          {/* Student Actions */}
          {userView === 'student' && ticket.status === 'Resolved' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket.id, 'Acknowledged')}
              className="secondary text-xs font-semibold px-3 py-1.5 bg-[#e8f2ee] text-[#245447] rounded-lg hover:bg-[#d8e8e1] transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#21815f]" />
              Confirm fixed
            </button>
          )}

          {ticket.status === 'Acknowledged' && (
            <span className="text-xs text-[#627a72] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3679a8]" />
              Ticket completed & verified
            </span>
          )}
        </div>

        {/* History Toggle */}
        {ticket.history && ticket.history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-[11px] font-medium text-[#71817b] hover:text-[#174c42] flex items-center gap-1 ml-auto"
            aria-expanded={showHistory}
          >
            <History className="w-3 h-3" />
            {showHistory ? 'Hide history' : 'History'}
          </button>
        )}
      </div>

      {/* History Drawer */}
      {showHistory && ticket.history && (
        <div className="mt-3 p-2.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec] text-xs space-y-1.5">
          <div className="font-bold text-[#173b34] text-[11px] uppercase tracking-wider mb-1">
            Audit Trail
          </div>
          {ticket.history.map((h, idx) => (
            <div key={idx} className="flex items-baseline justify-between text-[#536760] text-[11px]">
              <span>
                <span className="font-semibold text-[#173b34]">{h.by}</span>: {h.action}
                {h.note ? ` — "${h.note}"` : ''}
              </span>
              <span className="text-[#889b93] text-[10px]">
                {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};
