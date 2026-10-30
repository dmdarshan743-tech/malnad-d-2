export type TicketStatus = 'Open' | 'Resolved' | 'Acknowledged';

export type TicketCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Furniture'
  | 'Computer / Network'
  | 'Cleaning'
  | 'Other';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface TicketHistoryEntry {
  action: string;
  timestamp: number;
  by: string;
  note?: string;
}

export interface Ticket {
  id: number;
  title: string;
  category: TicketCategory;
  location: string;
  description: string;
  status: TicketStatus;
  date: string;
  createdAt: number;
  photo?: string;
  priority?: TicketPriority;
  resolutionNote?: string;
  history?: TicketHistoryEntry[];
}

export type UserView = 'student' | 'maintenance';

export interface TicketStats {
  total: number;
  open: number;
  resolved: number;
  acknowledged: number;
}
