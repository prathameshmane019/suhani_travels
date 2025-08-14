"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserModel = exports.SupportTicketModel = exports.RefundRequestModel = void 0;
const mongoose_1 = require("mongoose");
const RefundRequestSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    requestDate: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});
exports.RefundRequestModel = (0, mongoose_1.model)('RefundRequest', RefundRequestSchema);
const SupportTicketSchema = new mongoose_1.Schema({
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    subject: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    messages: { type: [Object], default: [] },
});
exports.SupportTicketModel = (0, mongoose_1.model)('SupportTicket', SupportTicketSchema);
const AdminUserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'support'], default: 'admin' },
    permissions: { type: [String], default: [] },
});
exports.AdminUserModel = (0, mongoose_1.model)('AdminUser', AdminUserSchema);
//# sourceMappingURL=types.js.map