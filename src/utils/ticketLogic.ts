import { Ticket, TicketStats, TicketStatus, TicketCategory, TicketPriority } from '../types.ts';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 102,
    title: 'Projector not working',
    category: 'Computer / Network',
    location: 'Seminar Hall',
    description: 'Projector does not turn on.',
    status: 'Open',
    date: 'Today',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    priority: 'High',
  },
  {
    id: 101,
    title: 'Water leakage near washroom',
    category: 'Plumbing',
    location: 'Block B, First floor',
    description: 'Water is leaking near the washroom entrance.',
    status: 'Open',
    date: 'Yesterday',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    priority: 'Medium',
  },
  {
    id: 100,
    title: 'Broken classroom fan',
    category: 'Electrical',
    location: 'Block A, Room 204',
    description: 'Fan repaired by maintenance team.',
    status: 'Resolved',
    date: 'Oct 27',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    priority: 'Low',
    resolutionNote: 'Motor bearing replaced and speed regulator tested.',
  },
];

export function calculateStats(tickets: Ticket[]): TicketStats {
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
    acknowledged: tickets.filter((t) => t.status === 'Acknowledged').length,
  };
}

export function getNextTicketId(tickets: Ticket[]): number {
  if (!tickets || tickets.length === 0) return 100;
  return Math.max(99, ...tickets.map((t) => t.id)) + 1;
}

export interface CreateTicketParams {
  title: string;
  category: TicketCategory;
  location: string;
  description: string;
  photo?: string;
  priority?: TicketPriority;
}

export function createTicket(
  existingTickets: Ticket[],
  params: CreateTicketParams
): Ticket {
  const trimmedTitle = params.title.trim();
  const trimmedLocation = params.location.trim();
  const trimmedDesc = params.description.trim();

  if (!trimmedTitle) {
    throw new Error('Complaint title is required');
  }
  if (!trimmedLocation) {
    throw new Error('Location is required');
  }
  if (!trimmedDesc) {
    throw new Error('Description is required');
  }

  const id = getNextTicketId(existingTickets);
  const newTicket: Ticket = {
    id,
    title: trimmedTitle,
    category: params.category,
    location: trimmedLocation,
    description: trimmedDesc,
    status: 'Open',
    date: 'Just now',
    createdAt: Date.now(),
    photo: params.photo,
    priority: params.priority || 'Medium',
    history: [
      {
        action: 'Created',
        timestamp: Date.now(),
        by: 'Student',
      },
    ],
  };

  return newTicket;
}

export function updateTicketStatus(
  tickets: Ticket[],
  ticketId: number,
  nextStatus: TicketStatus,
  actor: 'Student' | 'Maintenance' = 'Maintenance',
  note?: string
): Ticket[] {
  return tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;

    const existingHistory = ticket.history || [
      {
        action: 'Created',
        timestamp: ticket.createdAt,
        by: 'Requester',
      },
    ];

    const historyEntry = {
      action: `Status changed to ${nextStatus}`,
      timestamp: Date.now(),
      by: actor,
      note,
    };

    return {
      ...ticket,
      status: nextStatus,
      resolutionNote: note ? note : ticket.resolutionNote,
      history: [historyEntry, ...existingHistory],
    };
  });
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
}

export function filterTickets(tickets: Ticket[], options: FilterOptions): Ticket[] {
  const { search, category, status } = options;
  const q = search?.toLowerCase().trim();

  return tickets
    .slice()
    .sort((a, b) => b.id - a.id)
    .filter((t) => {
      if (status && status !== 'all' && t.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
      if (category && category !== 'all' && t.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (q) {
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesLocation = t.location.toLowerCase().includes(q);
        const matchesDescription = t.description.toLowerCase().includes(q);
        const matchesId = String(t.id).includes(q);
        if (!matchesTitle && !matchesLocation && !matchesDescription && !matchesId) {
          return false;
        }
      }
      return true;
    });
}

const STORAGE_KEY = 'fixit_campus_tickets_v1';

export function loadStoredTickets(): Ticket[] {
  if (typeof window === 'undefined') return INITIAL_TICKETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TICKETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveStoredTickets(tickets: Ticket[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error('Failed to save tickets to localStorage', err);
  }
}
