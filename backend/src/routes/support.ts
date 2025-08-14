import express from 'express';
import { SupportTicketModel } from '../types';

const router = express.Router();

// Get all support tickets
router.get('/', async (req, res) => {
  const tickets = await SupportTicketModel.find();
  res.json(tickets);
});

// Get a single support ticket by ID
router.get('/:id', async (req, res) => {
  const ticket = await SupportTicketModel.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Support ticket not found' });
  res.json(ticket);
});

// Create a new support ticket
router.post('/', async (req, res) => {
  const ticket = new SupportTicketModel({ ...req.body });
  await ticket.save();
  res.status(201).json(ticket);
});

// Update a support ticket
router.put('/:id', async (req, res) => {
  const ticket = await SupportTicketModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ticket) return res.status(404).json({ error: 'Support ticket not found' });
  res.json(ticket);
});

// Delete a support ticket
router.delete('/:id', async (req, res) => {
  const ticket = await SupportTicketModel.findByIdAndDelete(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Support ticket not found' });
  res.json(ticket);
});

export default router;
