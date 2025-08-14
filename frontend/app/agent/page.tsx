'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/utils';

interface Trip {
  _id: string;
  date: string;
  bus: {
    model: string;
    registrationNumber: string;
  }; 
  pickupPoints: string[];
  dropPoints: string[];
}

interface PassengerDetails {
  name: string;
  phone: string;
}

interface Booking {
  _id: string;
  seatNumbers: string[];
  passengerDetails: PassengerDetails[];
  status: string;
}

const AgentDashboardPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripBookings, setTripBookings] = useState<Booking[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchOngoingTrips = async () => {
      setLoadingTrips(true);
      setError(null);
      try {
        const response = await api.get(`/agent/ongoing-trips/${user?.busId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOngoingTrips(response.data);
      } catch (err) {
        console.error('Error fetching ongoing trips:', err);
        setError('Failed to load ongoing trips.');
      } finally {
        setLoadingTrips(false);
      }
    };

    if (token && user && user.role === 'agent') {
      fetchOngoingTrips();
    }
  }, [token, user]);

  const fetchTripBookings = async (tripId: string) => {
    setLoadingBookings(true);
    setError(null);
    try {
      const response = await api.get(`/agent/trip-bookings/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTripBookings(response.data);
    } catch (err) {
      console.error('Error fetching trip bookings:', err);
      setError('Failed to load trip bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    fetchTripBookings(trip._id);
  };

  if (!user || user.role !== 'agent') {
    return <div className="p-4 text-center">Redirecting to Login...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Agent Dashboard - { user.name }</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ongoing Trips</h2>
          {loadingTrips ? (
            <p>Loading trips...</p>
          ) : ongoingTrips.length === 0 ? (
            <p>No ongoing trips found for you.</p>
          ) : (
            <ul className="space-y-3">
              {ongoingTrips.map((trip) => (
                <li
                  key={trip._id}
                  className={`p-4 border rounded-md cursor-pointer transition-all duration-200 ${
                    selectedTrip?._id === trip._id ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTripSelect(trip)}
                > 
                  <p className="text-sm text-gray-600">Bus: {trip.bus.model} ({trip.bus.registrationNumber})</p>
                  <p className="text-sm text-gray-600">Date: {new Date(trip.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
          {selectedTrip ? (
            <>
               <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                <h3 className="font-bold">Trip Details:</h3>
                <p>Bus: {selectedTrip.bus.model} ({selectedTrip.bus.registrationNumber})</p>
                <p>Date: {new Date(selectedTrip.date).toLocaleDateString()}</p>
                <p>Pickup Points: {selectedTrip.pickupPoints.join(', ')}</p>
                <p>Drop Points: {selectedTrip.dropPoints.join(', ')}</p>
              </div>

              {loadingBookings ? (
                <p>Loading bookings...</p>
              ) : tripBookings.length === 0 ? (
                <p>No bookings found for this trip.</p>
              ) : (
                <div className="space-y-4">
                  {tripBookings.map((booking) => (
                    <div key={booking._id} className="border p-4 rounded-md bg-gray-50">
                      <p className="font-medium text-gray-800">Booking ID: {booking._id}</p>
                      <p className="text-sm text-gray-600">Seats: {booking.seatNumbers.join(', ')}</p>
                      <p className="text-sm text-gray-600">Status: {booking.status}</p>
                      <div className="mt-3 space-y-2">
                        {booking.passengerDetails.map((passenger, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                            <div>
                              <p className="font-semibold text-gray-700">Passenger: {passenger.name}</p>
                              <p className="text-sm text-gray-500">Phone: {passenger.phone}</p>
                            </div>
                            <a
                              href={`tel:${passenger.phone}`}
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                            >
                              Call
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">Select a trip from the left to view its bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardPage;
