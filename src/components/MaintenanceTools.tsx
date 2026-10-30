import React from 'react';
import { Ticket, TicketStats } from '../types.ts';
import {
  Wrench,
  PhoneCall,
  Download,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface MaintenanceToolsProps {
  tickets: Ticket[];
  stats: TicketStats;
  onFilterCategory: (category: string) => void;
  selectedCategory: string;
  onOpenNewTicketModal: () => void;
}

export const MaintenanceTools: React.FC<MaintenanceToolsProps> = ({
  tickets,
  stats,
  onFilterCategory,
  selectedCategory,
  onOpenNewTicketModal,
}) => {
  const openCount = stats.open;
  const highPriorityCount = tickets.filter(
    (t) => t.status === 'Open' && (t.priority === 'High' || t.priority === 'Emergency')
  ).length;

  const categories = ['Electrical', 'Plumbing', 'Computer / Network', 'Furniture', 'Cleaning'];

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Location', 'Status', 'Priority', 'Date', 'Description'];
    const rows = tickets.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.location.replace(/"/g, '""')}"`,
      t.status,
      t.priority || 'Medium',
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fixit_maintenance_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside
      className="panel bg-white border border-[#e1ebe6] rounded-[17px] p-5.5 shadow-[0_6px_22px_rgba(23,76,66,0.04)] space-y-5"
      id="sidePanel"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#172b26] tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#174c42]" />
            Maintenance Hub
          </h2>
          <span className="text-[11px] font-bold text-[#21815f] bg-[#e2f5eb] px-2.5 py-0.5 rounded-full">
            Active Shift
          </span>
        </div>
        <p className="text-xs text-[#71817b] leading-relaxed">
          Facility operations, triage filters, and rapid action tools for campus technicians.
        </p>
      </div>

      {/* Priority Banner */}
      {highPriorityCount > 0 ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block">
              {highPriorityCount} urgent / high-priority item{highPriorityCount > 1 ? 's' : ''}
            </span>
            <span className="text-amber-800">
              Immediate inspection requested in campus facilities.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No critical emergency backlogs right now.</span>
        </div>
      )}

      {/* Category Triage Shortcuts */}
      <div>
        <label className="block text-xs font-bold text-[#52645d] mb-2 flex items-center justify-between">
          <span>Category Quick Triage</span>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => onFilterCategory('all')}
              className="text-[11px] text-[#174c42] hover:underline font-semibold cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const count = tickets.filter((t) => t.category === cat && t.status === 'Open').length;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterCategory(isSelected ? 'all' : cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#174c42] text-white shadow-sm'
                    : 'bg-[#f0f5f3] text-[#2c4e45] hover:bg-[#e4ece8]'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-2 border-t border-[#e1ebe6] space-y-2">
        <button
          type="button"
          onClick={onOpenNewTicketModal}
          className="w-full text-xs font-semibold py-2.5 px-3 bg-[#174c42] text-white rounded-xl hover:bg-[#1f5f53] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>＋ Log Technician Work Order</span>
        </button>

        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full text-xs font-semibold py-2.5 px-3 bg-[#e8f2ee] text-[#245447] rounded-xl hover:bg-[#d8e8e1] transition-colors flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Work Orders (CSV)</span>
        </button>
      </div>

      {/* Campus Emergency Directory */}
      <div className="pt-2 border-t border-[#e1ebe6]">
        <div className="text-xs font-bold text-[#52645d] mb-2 flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-[#174c42]" />
          <span>Duty Hotline Numbers</span>
        </div>
        <ul className="text-xs space-y-1.5 text-[#5e7069]">
          <li className="flex justify-between">
            <span>Facilities Dispatch:</span>
            <span className="font-semibold text-[#173b34]">Ext. 104</span>
          </li>
          <li className="flex justify-between">
            <span>Duty Electrician:</span>
            <span className="font-semibold text-[#173b34]">Ext. 112</span>
          </li>
          <li className="flex justify-between">
            <span>Campus Security 24/7:</span>
            <span className="font-semibold text-[#173b34]">Ext. 200</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
