"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AuthSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    phone: { type: String, unique: true, sparse: true },
    registrationNumber: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
    role: { type: String, enum: ['passenger', 'admin', 'agent'], required: true },
    busId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bus', required: false },
});
// Hash password before saving
AuthSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    if (this.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
    }
    next();
});
// Compare password method
AuthSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.AuthModel = (0, mongoose_1.model)('Auth', AuthSchema);
//# sourceMappingURL=auth.js.map