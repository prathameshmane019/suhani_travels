"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../types");
const router = express_1.default.Router();
// Get all refund requests
router.get('/', async (req, res) => {
    const refunds = await types_1.RefundRequestModel.find();
    res.json(refunds);
});
// Get a single refund request by ID
router.get('/:id', async (req, res) => {
    const refund = await types_1.RefundRequestModel.findById(req.params.id);
    if (!refund)
        return res.status(404).json({ error: 'Refund request not found' });
    res.json(refund);
});
// Create a new refund request
router.post('/', async (req, res) => {
    const refund = new types_1.RefundRequestModel({ ...req.body, requestDate: new Date().toISOString() });
    await refund.save();
    res.status(201).json(refund);
});
// Update a refund request
router.put('/:id', async (req, res) => {
    const refund = await types_1.RefundRequestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!refund)
        return res.status(404).json({ error: 'Refund request not found' });
    res.json(refund);
});
// Delete a refund request
router.delete('/:id', async (req, res) => {
    const refund = await types_1.RefundRequestModel.findByIdAndDelete(req.params.id);
    if (!refund)
        return res.status(404).json({ error: 'Refund request not found' });
    res.json(refund);
});
exports.default = router;
//# sourceMappingURL=refunds.js.map