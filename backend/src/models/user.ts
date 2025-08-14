import { Schema, model, Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  phone?: string;
  age?: number;
  gender?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  age: { type: Number, required: false },
  gender: { type: String, required: false }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = model<IUserDocument>('User', UserSchema);