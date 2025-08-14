"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TicketComponent from '@/components/TicketComponent';
import { api } from '@/lib/utils'; // Assuming api utility is available

interface ApiBooking {
  _id: string;
  bookingReference: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  totalPrice: number;
  paymentStatus: 'completed' | 'pending';
  seatNumbers: string[];
  passengerDetails: {
    name: string;
    phone: string;
    email?: string;
  }[];
  tripId: {
    _id: string;
    date: string;
    bus: {
      registrationNumber: string;
      model: string;
      type: string;
    };
    route: {
      from: string;
      to: string;
      duration: string;
    };
    schedule: {
      endTime: string;
      startTime: string;
    };
  };
  boardingPoint: { name: string; sequence: number };
  dropoffPoint: { name: string; sequence: number };
}


// Define IBooking interface (copy from bookings/page.tsx for consistency)
interface IBooking {
  _id: string; 
  boardingPoint: { name: string; sequence: number };
  dropoffPoint: { name: string; sequence: number };
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  seats: string[];
  passenger: {
    name: string;
    phone: string;
    email?: string;
  };
  bus: {
    registrationNumber: string;
    model: string;
    type: string; 
  };
  route: {
    from: string;
    to: string;
    duration: string;
  };
  schedule: {
    endTime: string;
    startTime: string;
  };
  tripId: {
    _id: string;
    date: string;
  };
}

const TicketPage = () => { 
  const params =useParams();
  const id = params.id as string; // Extracting the ID from the URL parameters
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          // Assuming an API endpoint to fetch a single booking by ID
          const response = await api.get(`/bookings/${id}`);
          const b: ApiBooking = response.data; // Assuming the API returns the booking directly
          
          // Map the API response to IBooking interface if necessary
          const mappedBooking: IBooking = {
            _id: b._id,
            bookingId: b.bookingReference, // Adjust based on actual API response
            status: b.status,
            bookingDate: b.bookingDate,
            travelDate: b.tripId.date,
            totalAmount: b.totalPrice,
            paymentStatus: b.paymentStatus === 'completed' ? 'paid' : 'pending',
            seats: b.seatNumbers,
            passenger: b.passengerDetails[0], // Assuming first passenger is the main one
            bus: b.tripId.bus,
            route: b.tripId.route,
            schedule: b.tripId.schedule,
            boardingPoint: b.boardingPoint, // Assuming this is part of the booking details
            dropoffPoint: b.dropoffPoint,     // Assuming this is part of the booking details
            tripId: {
              _id: b.tripId._id,
              date: b.tripId.date
            },
          };
          setBooking(mappedBooking);
        } catch (err) {
          const error = err as { response?: { data?: { message?: string } } };
          setError(error.response?.data?.message || 'Failed to fetch ticket details.');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading ticket...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!booking) {
    return <div className="flex justify-center items-center min-h-screen">Ticket not found.</div>;
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <TicketComponent booking={booking} />
      </div>
    // </div>
  );
};

export default TicketPage;