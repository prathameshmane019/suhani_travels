
'use client';
import React from 'react';
import { Phone, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PassengerDetails {
  name: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
}

interface Booking {
  _id: string;
  tripId: string;
  seatNumbers: string[];
  passengerDetails: PassengerDetails[];
  totalPrice: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  boardingPoint?: { name: string; sequence: number; };
  dropoffPoint?: { name: string; sequence: number; };
  userId?: string;
}

interface PassengerCardProps {
  booking: Booking;
}

const PassengerCard: React.FC<PassengerCardProps> = ({ booking }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      {booking.passengerDetails.map((passenger, index) => (
        <div key={`${booking._id}-${index}`} className="mb-4 last:mb-0">
          <p className="text-sm font-medium text-gray-900">Seat(s): <span className="font-normal">{booking.seatNumbers.join(', ')}</span></p>
          <p className="text-sm font-medium text-gray-900">Passenger: <span className="font-normal">{passenger.name}</span></p>
          <p className="text-sm font-medium text-gray-900">Gender: <span className="font-normal">{passenger.gender}</span></p>
          <p className="text-sm font-medium text-gray-900">Phone: <span className="font-normal">{passenger.phone}</span></p>
          <p className="text-sm font-medium text-gray-900">Boarding: <span className="font-normal">{booking.boardingPoint?.name} (Seq: {booking.boardingPoint?.sequence})</span></p>
          <p className="text-sm font-medium text-gray-900">Drop-off: <span className="font-normal">{booking.dropoffPoint?.name} (Seq: {booking.dropoffPoint?.sequence})</span></p>
          <p className="text-sm font-medium text-gray-900">Status: <span className="font-normal">{booking.status}</span></p>
          <p className="text-sm font-medium text-gray-900">Payment: <span className="font-normal">{booking.paymentMethod} ({booking.paymentStatus})</span></p>
          <div className="flex items-center space-x-2 mt-3">
            <a
              href={`tel:${passenger.phone}`}
              className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-gray-100"
              title="Call Passenger"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PassengerCard;
