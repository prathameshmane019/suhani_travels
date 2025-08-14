import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAuthDocument extends Document {
  name?: string; // For agent and admin
  phone?: string; // For passenger
  registrationNumber?: string; // For agent
  password?: string;
  userId?: Types.ObjectId; // For passenger
  role: 'passenger' | 'admin' | 'agent';
  busId?: Types.ObjectId; // For agent
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const AuthSchema = new Schema<IAuthDocument>({
  name: { type: String, required: false },
  phone: { type: String, unique: true, sparse: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, select: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  role: { type: String, enum: ['passenger', 'admin', 'agent'], required: true },
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: false },
});

// Hash password before saving
AuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
AuthSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const AuthModel = model<IAuthDocument>('Auth', AuthSchema);
