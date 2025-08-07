export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'maintenance' | 'inactive';

export interface Bus {
  id: string;
  name: string;
  type: BusType;
  totalSeats: number;
  amenities: string[];
  image?: string;
  price: number;
  status: BusStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusFormData {
  name: string;
  type: BusType;
  totalSeats: number;
  amenities: string[];
  image: File | null; 
  price: number;
  status: BusStatus;
}

export interface BusFilters {
  search: string;
  type: BusType | 'all';
  status: BusStatus | 'all';
}
