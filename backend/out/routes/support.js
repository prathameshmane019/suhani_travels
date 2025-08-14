"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../types");
const router = express_1.default.Router();
// Get all support tickets
router.get('/', async (req, res) => {
    const tickets = await types_1.SupportTicketModel.find();
    res.json(tickets);
});
// Get a single support ticket by ID
router.get('/:id', async (req, res) => {
    const ticket = await types_1.SupportTicketModel.findById(req.params.id);
    if (!ticket)
        return res.status(404).json({ error: 'Support ticket not found' });
    res.json(ticket);
});
// Create a new support ticket
router.post('/', async (req, res) => {
    const ticket = new types_1.SupportTicketModel({ ...req.body });
    await ticket.save();
    res.status(201).json(ticket);
});
// Update a support ticket
router.put('/:id', async (req, res) => {
    const ticket = await types_1.SupportTicketModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket)
        return res.status(404).json({ error: 'Support ticket not found' });
    res.json(ticket);
});
// Delete a support ticket
router.delete('/:id', async (req, res) => {
    const ticket = await types_1.SupportTicketModel.findByIdAndDelete(req.params.id);
    if (!ticket)
        return res.status(404).json({ error: 'Support ticket not found' });
    res.json(ticket);
});
exports.default = router;
//# sourceMappingURL=support.js.map