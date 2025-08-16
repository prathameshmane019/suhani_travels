'use client'; 
import React, { useState, useMemo, useEffect } from 'react';
import { useAgentDashboard } from '@/lib/AgentDashboardContext';
import { api } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NewBookingForm from '@/components/agent/NewBookingForm';
import PassengerTable from '@/components/agent/PassengerTable';
import PassengerCard from '@/components/agent/PassengerCard';
import SortOptions from '@/components/agent/SortOptions';
import Link from 'next/link';
import { AxiosError } from 'axios';

 

 

type SortBy = 'seat' | 'sequence' | 'name';
type SortOrder = 'asc' | 'desc';

interface NewBookingData {
  seatNumbers: string;
  passengerName: string;
  passengerGender: 'male' | 'female' | 'other';
  passengerPhone: string;
  passengerEmail: string;
  totalPrice: string; 
  paymentMethod: string;
  boardingPointName: string;
  boardingPointSequence: string;
  dropoffPointName: string;
  dropoffPointSequence: string;
}

const AgentTripPassengersPage = () => {
  const { tripId } = useParams();
  const { tripBookings, loadingBookings, error, fetchTripBookings, ongoingTrips } = useAgentDashboard();


  const [sortBy, setSortBy] = useState<SortBy>('sequence');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [newBookingData, setNewBookingData] = useState<NewBookingData>({
    seatNumbers: '',
    passengerName: '',
    passengerGender: 'male',
    passengerPhone: '',
    passengerEmail: '',
    totalPrice: '',
    paymentMethod: 'cash',  
    boardingPointName: '',
    boardingPointSequence: '',
    dropoffPointName: '',
    dropoffPointSequence: '',
  });

  const selectedTrip = useMemo(() => {
    return ongoingTrips.find(trip => trip._id === tripId);
  }, [ongoingTrips, tripId]);

  useEffect(() => {
    if (tripId) {
      fetchTripBookings(tripId as string);
    }
  }, [tripId, fetchTripBookings]);

  const sortedBookings = useMemo(() => {
    const sortableBookings = [...tripBookings];

    if (sortBy === 'seat') {
      sortableBookings.sort((a, b) => {
        const seatA = a.seatNumbers[0] || '';
        const seatB = b.seatNumbers[0] || '';
        return sortOrder === 'asc' ? seatA.localeCompare(seatB) : seatB.localeCompare(seatA);
      });
    } else if (sortBy === 'sequence') {
      sortableBookings.sort((a, b) => {
        const seqA = a.boardingPoint?.sequence || 0;
        const seqB = b.boardingPoint?.sequence || 0;
        return sortOrder === 'asc' ? seqA - seqB : seqB - seqA;
      });
    } else if (sortBy === 'name') {
      sortableBookings.sort((a, b) => {
        const nameA = a.passengerDetails[0]?.name || '';
        const nameB = b.passengerDetails[0]?.name || '';
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    }
    return sortableBookings;
  }, [tripBookings, sortBy, sortOrder]);

  const handleNewBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean } }) => {
    const { name, value } = e.target;

    if (name === 'boardingPointName') {
      const selectedPoint = selectedTrip?.route?.stops?.find(p => p.name === value as string);
      if (selectedPoint) {
        setNewBookingData(prev => ({ ...prev, boardingPointName: value as string, boardingPointSequence: selectedPoint.sequence.toString() }));
      }
    } else if (name === 'dropoffPointName') {
      const selectedPoint = selectedTrip?.route.stops.find(p => p.name === value as string);
      if (selectedPoint) {
        setNewBookingData(prev => ({ ...prev, dropoffPointName: value as string, dropoffPointSequence: selectedPoint.sequence.toString() }));
      }
    } else {
      setNewBookingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) {
      toast.error('Please select a trip first.');
      return;
    }

    try {
      const bookingPayload = {
        tripId: selectedTrip._id,
        seatNumbers: newBookingData.seatNumbers.split(',').map(s => s.trim()),
        passengerDetails: [{
          name: newBookingData.passengerName,
          gender: newBookingData.passengerGender,
          phone: newBookingData.passengerPhone,
          email: newBookingData.passengerEmail || undefined,
        }],
        totalPrice: parseFloat(newBookingData.totalPrice),
        paymentMethod: newBookingData.paymentMethod, 
        boardingPoint: {
          name: newBookingData.boardingPointName,
          sequence: parseInt(newBookingData.boardingPointSequence),
        },
        dropoffPoint: {
          name: newBookingData.dropoffPointName,
          sequence: parseInt(newBookingData.dropoffPointSequence),
        },
      };

      await api.post('/agent/bookings', bookingPayload);
      toast.success('Booking created successfully!');
      setShowNewBookingForm(false);
      setNewBookingData({
        seatNumbers: '',
        passengerName: '',
        passengerGender: 'male',
        passengerPhone: '',
        passengerEmail: '',
        totalPrice: '',
        paymentMethod: 'cash', 
        boardingPointName: '',
        boardingPointSequence: '',
        dropoffPointName: '',
        dropoffPointSequence: '',
      });
      fetchTripBookings(selectedTrip._id);
    } catch (err: unknown) {
      console.error('Error creating booking:', err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to create booking.');
      }
    }
  };

  if (!selectedTrip) {
    return (
      <div className="p-4 text-center">
        <p>Loading trip details or trip not found. Please select a trip from the <Link href="/agent" className="text-blue-500 hover:underline">Trips page</Link>.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Passenger Details for Trip: {selectedTrip.bus.busModel} ({selectedTrip.bus.registrationNumber}) on {new Date(selectedTrip.date).toLocaleDateString()}</h2>

      

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <SortOptions sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <Button
          onClick={() => setShowNewBookingForm(!showNewBookingForm)}
          className="w-full md:w-auto"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {showNewBookingForm && (
        <NewBookingForm
          newBookingData={newBookingData}
          handleNewBookingChange={handleNewBookingChange}
          handleNewBookingSubmit={handleNewBookingSubmit}
          setShowNewBookingForm={setShowNewBookingForm}
          selectedTrip={selectedTrip}
          isAgent={true}
        />
      )}

      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : sortedBookings.length === 0 ? (
        <p>No bookings found for this trip.</p>
      ) : (
        <>
          <PassengerTable bookings={sortedBookings} />
          <div className="md:hidden space-y-4">
            {sortedBookings.map((booking) => (
              <PassengerCard key={booking._id} booking={booking} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentTripPassengersPage;