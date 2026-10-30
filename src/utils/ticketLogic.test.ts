import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TICKETS,
  calculateStats,
  getNextTicketId,
  createTicket,
  updateTicketStatus,
  filterTickets,
} from './ticketLogic.ts';
import { Ticket } from '../types.ts';

test('calculateStats calculates correct counts for initial tickets', () => {
  const stats = calculateStats(INITIAL_TICKETS);
  assert.equal(stats.total, 3);
  assert.equal(stats.open, 2);
  assert.equal(stats.resolved, 1);
  assert.equal(stats.acknowledged, 0);
});

test('getNextTicketId computes maximum id + 1', () => {
  const id = getNextTicketId(INITIAL_TICKETS);
  assert.equal(id, 103);

  const emptyId = getNextTicketId([]);
  assert.equal(emptyId, 100);
});

test('createTicket creates a new ticket with valid defaults and increments id', () => {
  const newTicket = createTicket(INITIAL_TICKETS, {
    title: 'Broken chair',
    category: 'Furniture',
    location: 'Library 2nd Floor',
    description: 'Arm rest is cracked and wobbling.',
  });

  assert.equal(newTicket.id, 103);
  assert.equal(newTicket.title, 'Broken chair');
  assert.equal(newTicket.category, 'Furniture');
  assert.equal(newTicket.location, 'Library 2nd Floor');
  assert.equal(newTicket.status, 'Open');
  assert.equal(newTicket.priority, 'Medium');
  assert.ok(newTicket.createdAt > 0);
  assert.equal(newTicket.history?.length, 1);
});

test('createTicket rejects blank required fields', () => {
  assert.throws(() => {
    createTicket(INITIAL_TICKETS, {
      title: '   ',
      category: 'Cleaning',
      location: 'Block C',
      description: 'Needs mop',
    });
  }, /Complaint title is required/);

  assert.throws(() => {
    createTicket(INITIAL_TICKETS, {
      title: 'Valid title',
      category: 'Cleaning',
      location: '',
      description: 'Needs mop',
    });
  }, /Location is required/);

  assert.throws(() => {
    createTicket(INITIAL_TICKETS, {
      title: 'Valid title',
      category: 'Cleaning',
      location: 'Hall',
      description: '   ',
    });
  }, /Description is required/);
});

test('updateTicketStatus correctly transitions status and records history', () => {
  const updated = updateTicketStatus(INITIAL_TICKETS, 102, 'Resolved', 'Maintenance', 'Replaced HDMI cable');
  const ticket102 = updated.find((t) => t.id === 102);
  assert.ok(ticket102);
  assert.equal(ticket102.status, 'Resolved');
  assert.equal(ticket102.resolutionNote, 'Replaced HDMI cable');
  assert.equal(ticket102.history?.[0].action, 'Status changed to Resolved');

  const stats = calculateStats(updated);
  assert.equal(stats.open, 1);
  assert.equal(stats.resolved, 2);
  assert.equal(stats.acknowledged, 0);

  const acked = updateTicketStatus(updated, 102, 'Acknowledged', 'Student');
  const acked102 = acked.find((t) => t.id === 102);
  assert.equal(acked102?.status, 'Acknowledged');
  const ackedStats = calculateStats(acked);
  assert.equal(ackedStats.open, 1);
  assert.equal(ackedStats.resolved, 1);
  assert.equal(ackedStats.acknowledged, 1);
});

test('filterTickets correctly filters by query, category, and status', () => {
  const filteredQuery = filterTickets(INITIAL_TICKETS, { search: 'projector' });
  assert.equal(filteredQuery.length, 1);
  assert.equal(filteredQuery[0].id, 102);

  const filteredCategory = filterTickets(INITIAL_TICKETS, { category: 'Plumbing' });
  assert.equal(filteredCategory.length, 1);
  assert.equal(filteredCategory[0].id, 101);

  const filteredStatus = filterTickets(INITIAL_TICKETS, { status: 'resolved' });
  assert.equal(filteredStatus.length, 1);
  assert.equal(filteredStatus[0].id, 100);
});
