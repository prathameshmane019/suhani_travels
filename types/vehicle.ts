export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
  totalSeats: number;
  amenities: string[];
  status: 'active' | 'maintenance' | 'inactive';
}
