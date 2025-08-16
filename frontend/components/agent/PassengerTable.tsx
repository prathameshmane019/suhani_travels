
'use client';
import { Phone } from 'lucide-react';
import React from 'react';
 

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

interface PassengerTableProps {
  bookings: Booking[];
}

const PassengerTable: React.FC<PassengerTableProps> = ({ bookings }) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg hidden md:table">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat(s)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boarding Point</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop-off Point</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <React.Fragment key={booking._id}>
              {booking.passengerDetails.map((passenger, index) => (
                <tr key={`${booking._id}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.seatNumbers[index] || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.boardingPoint?.name} (Seq: {booking.boardingPoint?.sequence})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.dropoffPoint?.name} (Seq: {booking.dropoffPoint?.sequence})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.paymentMethod} ({booking.paymentStatus})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${passenger.phone}`}
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-gray-100"
                        title="Call Passenger"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
