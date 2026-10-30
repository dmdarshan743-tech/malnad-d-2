import React from 'react';
import { UserView } from '../types.ts';
import { Wrench, ShieldAlert, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentView: UserView;
  onViewChange: (view: UserView) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onResetData,
}) => {
  return (
    <header className="bg-[#174c42] text-white px-4 sm:px-8 lg:px-16 py-4 transition-colors">
      <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-9.5 h-9.5 rounded-xl bg-[#d7f4e9] text-[#174c42] grid place-items-center font-black text-xl shadow-inner select-none"
            aria-hidden="true"
          >
            F
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight">FixIt</span>
            <span className="text-xs font-semibold tracking-wider text-emerald-200/80 uppercase">
              Campus Care
            </span>
          </div>
        </div>

        {/* View Switcher and Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <nav
            className="flex items-center bg-[#133f37] p-1 rounded-xl border border-emerald-800/40"
            aria-label="Role View Selector"
          >
            <button
              type="button"
              onClick={() => onViewChange('student')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentView === 'student'
                  ? 'bg-white text-[#174c42] shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
              data-view="student"
              aria-pressed={currentView === 'student'}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => onViewChange('maintenance')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'maintenance'
                  ? 'bg-white text-[#174c42] shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
              data-view="maintenance"
              aria-pressed={currentView === 'maintenance'}
            >
              <Wrench className="w-3.5 h-3.5" />
              Maintenance
            </button>
          </nav>

          <button
            type="button"
            onClick={onResetData}
            title="Reset to sample demo data"
            className="text-xs font-medium text-emerald-200/70 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1 transition-colors border border-transparent hover:border-emerald-700/50"
            aria-label="Reset demo tickets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
