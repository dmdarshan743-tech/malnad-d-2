import React from 'react';
import { X, Download } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  title: string | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  photoUrl,
  title,
  onClose,
}) => {
  if (!isOpen || !photoUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged photo preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 bg-[#174c42] text-white">
          <h3 className="text-sm font-bold truncate max-w-[80%]">
            {title ? `Attached Photo: ${title}` : 'Attached Photo'}
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={photoUrl}
              download="ticket-photo.jpg"
              className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-100 hover:text-white transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-100 hover:text-white transition-colors cursor-pointer"
              aria-label="Close photo view"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh] overflow-hidden">
          <img
            src={photoUrl}
            alt={title || 'Attached facility defect'}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
