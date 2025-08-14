import express from 'express';
import { RefundRequestModel } from '../types';

const router = express.Router();

// Get all refund requests
router.get('/', async (req, res) => {
  const refunds = await RefundRequestModel.find();
  res.json(refunds);
});

// Get a single refund request by ID
router.get('/:id', async (req, res) => {
  const refund = await RefundRequestModel.findById(req.params.id);
  if (!refund) return res.status(404).json({ error: 'Refund request not found' });
  res.json(refund);
});

// Create a new refund request
router.post('/', async (req, res) => {
  const refund = new RefundRequestModel({ ...req.body, requestDate: new Date().toISOString() });
  await refund.save();
  res.status(201).json(refund);
});

// Update a refund request
router.put('/:id', async (req, res) => {
  const refund = await RefundRequestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!refund) return res.status(404).json({ error: 'Refund request not found' });
  res.json(refund);
});

// Delete a refund request
router.delete('/:id', async (req, res) => {
  const refund = await RefundRequestModel.findByIdAndDelete(req.params.id);
  if (!refund) return res.status(404).json({ error: 'Refund request not found' });
  res.json(refund);
});

export default router;
