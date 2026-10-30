import React from 'react';
import { TicketStats } from '../types.ts';

interface StatsCardsProps {
  stats: TicketStats;
  selectedStatusFilter: string;
  onSelectFilter: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  selectedStatusFilter,
  onSelectFilter,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-6" aria-label="Ticket statistics">
      {/* Total Tickets */}
      <button
        type="button"
        onClick={() => onSelectFilter(selectedStatusFilter === 'all' ? 'all' : 'all')}
        className={`text-left bg-white border rounded-[17px] p-4.5 transition-all cursor-pointer shadow-[0_6px_22px_rgba(23,76,66,0.04)] hover:shadow-md ${
          selectedStatusFilter === 'all'
            ? 'border-[#174c42] ring-2 ring-[#174c42]/10'
            : 'border-[#e1ebe6] hover:border-[#cbd8d2]'
        }`}
        aria-label={`Total tickets: ${stats.total}. Click to show all.`}
      >
        <small className="block text-xs font-semibold text-[#73827d]">Total tickets</small>
        <div className="text-[29px] font-extrabold text-[#172b26] mt-1.5 leading-tight" id="total">
          {stats.total}
        </div>
      </button>

      {/* Open */}
      <button
        type="button"
        onClick={() => onSelectFilter(selectedStatusFilter === 'Open' ? 'all' : 'Open')}
        className={`text-left bg-white border rounded-[17px] p-4.5 transition-all cursor-pointer shadow-[0_6px_22px_rgba(23,76,66,0.04)] hover:shadow-md ${
          selectedStatusFilter === 'Open'
            ? 'border-[#bb7726] ring-2 ring-[#bb7726]/15 bg-amber-50/20'
            : 'border-[#e1ebe6] hover:border-amber-200'
        }`}
        aria-label={`Open tickets: ${stats.open}. Click to filter open.`}
      >
        <div className="flex items-center justify-between">
          <small className="block text-xs font-semibold text-[#73827d]">Open</small>
          {selectedStatusFilter === 'Open' && (
            <span className="text-[10px] uppercase font-bold text-[#bb7726] bg-amber-100/70 px-1.5 py-0.5 rounded">
              Active filter
            </span>
          )}
        </div>
        <div className="text-[29px] font-extrabold text-[#bb7726] mt-1.5 leading-tight" id="openCount">
          {stats.open}
        </div>
      </button>

      {/* Resolved */}
      <button
        type="button"
        onClick={() => onSelectFilter(selectedStatusFilter === 'Resolved' ? 'all' : 'Resolved')}
        className={`text-left bg-white border rounded-[17px] p-4.5 transition-all cursor-pointer shadow-[0_6px_22px_rgba(23,76,66,0.04)] hover:shadow-md ${
          selectedStatusFilter === 'Resolved'
            ? 'border-[#21815f] ring-2 ring-[#21815f]/15 bg-emerald-50/20'
            : 'border-[#e1ebe6] hover:border-emerald-200'
        }`}
        aria-label={`Resolved tickets: ${stats.resolved}. Click to filter resolved.`}
      >
        <div className="flex items-center justify-between">
          <small className="block text-xs font-semibold text-[#73827d]">Resolved</small>
          {selectedStatusFilter === 'Resolved' && (
            <span className="text-[10px] uppercase font-bold text-[#21815f] bg-emerald-100/70 px-1.5 py-0.5 rounded">
              Active filter
            </span>
          )}
        </div>
        <div className="text-[29px] font-extrabold text-[#21815f] mt-1.5 leading-tight" id="resolvedCount">
          {stats.resolved}
        </div>
      </button>

      {/* Acknowledged */}
      <button
        type="button"
        onClick={() => onSelectFilter(selectedStatusFilter === 'Acknowledged' ? 'all' : 'Acknowledged')}
        className={`text-left bg-white border rounded-[17px] p-4.5 transition-all cursor-pointer shadow-[0_6px_22px_rgba(23,76,66,0.04)] hover:shadow-md ${
          selectedStatusFilter === 'Acknowledged'
            ? 'border-[#3679a8] ring-2 ring-[#3679a8]/15 bg-blue-50/20'
            : 'border-[#e1ebe6] hover:border-blue-200'
        }`}
        aria-label={`Acknowledged tickets: ${stats.acknowledged}. Click to filter acknowledged.`}
      >
        <div className="flex items-center justify-between">
          <small className="block text-xs font-semibold text-[#73827d]">Acknowledged</small>
          {selectedStatusFilter === 'Acknowledged' && (
            <span className="text-[10px] uppercase font-bold text-[#3679a8] bg-blue-100/70 px-1.5 py-0.5 rounded">
              Active filter
            </span>
          )}
        </div>
        <div className="text-[29px] font-extrabold text-[#3679a8] mt-1.5 leading-tight" id="ackCount">
          {stats.acknowledged}
        </div>
      </button>
    </section>
  );
};
