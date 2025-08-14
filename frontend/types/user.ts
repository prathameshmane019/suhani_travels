export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'passenger' | 'admin' | 'agent';
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  busId?: string;
  password?: string;
}
