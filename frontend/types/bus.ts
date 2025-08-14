

export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'inactive' | 'maintenance';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusFormData {
  name: string;
  type: BusType;
  seats: number;
  amenities: string[];
  image: File | null;
  status: BusStatus;
  seatLayout:SeatLayout;
  agentPassword:string;
  registrationNumber: string;
  model: string;
}


export interface SeatPosition {
  id: string
  row: number
  column: number
  type: "regular" | "premium" | "disabled" | "empty"
  price?: number
  label?: string
  seatLayout?: SeatLayout
}

export interface SeatLayout {
  id: string
  name: string
  rows: number
  columns: number
  seats: SeatPosition[]
  totalSeats: number
}

export interface BookedSeat {
  seatId: string
  passengerName?: string
  bookingId?: string
}
export interface BusFilters {
  search: string;
  type: string;
  status: string;
}