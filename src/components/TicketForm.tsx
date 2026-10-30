import React, { useState, useRef } from 'react';
import { TicketCategory, TicketPriority } from '../types.ts';
import { CreateTicketParams } from '../utils/ticketLogic.ts';
import { PlusCircle, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface TicketFormProps {
  onSubmitTicket: (params: CreateTicketParams) => void;
  noticeMessage: string | null;
}

const CATEGORIES: TicketCategory[] = [
  'Electrical',
  'Plumbing',
  'Furniture',
  'Computer / Network',
  'Cleaning',
  'Other',
];

const PRIORITIES: { label: string; value: TicketPriority }[] = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium (Standard)', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Emergency', value: 'Emergency' },
];

export const TicketForm: React.FC<TicketFormProps> = ({
  onSubmitTicket,
  noticeMessage,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Electrical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !description.trim()) {
      return;
    }

    onSubmitTicket({
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      priority,
      photo: photoDataUrl || undefined,
    });

    // Reset form fields
    setTitle('');
    setLocation('');
    setDescription('');
    setPriority('Medium');
    handleRemovePhoto();
  };

  return (
    <aside
      className="panel bg-white border border-[#e1ebe6] rounded-[17px] p-5.5 shadow-[0_6px_22px_rgba(23,76,66,0.04)]"
      id="sidePanel"
    >
      <h2 className="text-lg font-bold text-[#172b26] mb-4 tracking-tight flex items-center justify-between">
        <span>Raise a ticket</span>
        <span className="text-[11px] font-semibold text-[#548b7d] bg-[#d7f4e9]/70 px-2.5 py-0.5 rounded-full">
          Quick Request
        </span>
      </h2>

      <form id="ticketForm" onSubmit={handleSubmit} className="grid gap-3">
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-[#52645d] mb-1.5">
            Complaint title *
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fan not working"
            className="w-full px-3 py-2.5 text-sm border border-[#dce7e1] rounded-[10px] bg-[#fbfdfc] text-[#19332c] placeholder:text-[#97a7a1] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42] transition-colors"
          />
        </div>

        <div className="row grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="category" className="block text-xs font-bold text-[#52645d] mb-1.5">
              Issue category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full px-3 py-2.5 text-sm border border-[#dce7e1] rounded-[10px] bg-[#fbfdfc] text-[#19332c] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42] transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-xs font-bold text-[#52645d] mb-1.5">
              Location *
            </label>
            <input
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block A, Room 204"
              className="w-full px-3 py-2.5 text-sm border border-[#dce7e1] rounded-[10px] bg-[#fbfdfc] text-[#19332c] placeholder:text-[#97a7a1] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42] transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-xs font-bold text-[#52645d] mb-1.5">
            Urgency / Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            className="w-full px-3 py-2.5 text-sm border border-[#dce7e1] rounded-[10px] bg-[#fbfdfc] text-[#19332c] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42] transition-colors cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold text-[#52645d] mb-1.5">
            Description *
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem, specific equipment number, or hazard..."
            className="w-full min-h-[82px] px-3 py-2.5 text-sm border border-[#dce7e1] rounded-[10px] bg-[#fbfdfc] text-[#19332c] placeholder:text-[#97a7a1] focus:outline-none focus:ring-2 focus:ring-[#174c42]/20 focus:border-[#174c42] resize-y transition-colors"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block text-xs font-bold text-[#52645d] mb-1.5">
            Photo (optional)
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="w-full text-xs text-[#71817b] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#e8f2ee] file:text-[#245447] hover:file:bg-[#d8e8e1] file:cursor-pointer cursor-pointer border border-[#dce7e1] rounded-[10px] p-1.5 bg-[#fbfdfc]"
          />

          {photoDataUrl && (
            <div className="mt-2 flex items-center justify-between p-2 bg-[#f0f9f5] border border-[#cbe8dc] rounded-lg">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={photoDataUrl}
                  alt="Preview"
                  className="w-8 h-8 rounded object-cover border border-[#b8dfce]"
                />
                <span className="text-xs font-medium text-[#1e5244] truncate max-w-[180px]">
                  {photoFileName || 'Attached photo'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                title="Remove photo"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="primary w-full mt-1 py-3 px-4 bg-[#174c42] hover:bg-[#1a574b] active:scale-[0.99] text-white font-bold rounded-[11px] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>＋ Submit complaint</span>
        </button>
      </form>

      <div
        id="notice"
        className="muted text-xs text-[#71817b] mt-3"
        aria-live="polite"
      >
        {noticeMessage || 'Fields marked * are required.'}
      </div>
    </aside>
  );
};
