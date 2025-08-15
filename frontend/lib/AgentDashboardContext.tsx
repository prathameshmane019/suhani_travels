// Path: e:\suhani_bus\frontend\lib\AgentDashboardContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect,useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from './utils';
import { IRoute } from '@/types/route';

interface Trip {
  _id: string;
  date: string;
  bus: {
    busModel: string;
    registrationNumber: string;
  }; 
  price: number; // Price per seat
  route:string | IRoute
  bookedSeats: string[];
}

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
  userId?: string; // Assuming userId might be populated
}

interface AgentDashboardContextType {
  ongoingTrips: Trip[];
  loadingTrips: boolean;
  error: string | null;
  tripBookings: Booking[];
  loadingBookings: boolean;
  fetchTripBookings: (tripId: string) => Promise<void>;
  refreshTrips: () => void;
  refreshBookings: (tripId: string) => void;
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip | null) => void;
}

const AgentDashboardContext = createContext<AgentDashboardContextType | undefined>(undefined);

export const AgentDashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripBookings, setTripBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const fetchOngoingTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      if (user?.busId) {
        const response = await api.get(`/agent/ongoing-trips/${user.busId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOngoingTrips(response.data);
      } else {
        setOngoingTrips([]);
      }
    } catch (err) {
      console.error('Error fetching ongoing trips:', err);
      setError('Failed to load ongoing trips.');
    } finally {
      setLoadingTrips(false);
    }
  }, [token, user?.busId]);

  const fetchTripBookings = useCallback(async (tripId: string) => {
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
  }, [token]);

  useEffect(() => {
    if (token && user?.busId && user?.role === 'agent') {
      fetchOngoingTrips();
    }
  }, [token, user?.busId, user?.role, fetchOngoingTrips]);

  const refreshTrips = () => {
    if (token && user && user.role === 'agent') {
      fetchOngoingTrips();
    }
  };

  const refreshBookings = (tripId: string) => {
    fetchTripBookings(tripId);
  };

  return (
    <AgentDashboardContext.Provider
      value={{
        ongoingTrips,
        loadingTrips,
        error,
        tripBookings,
        loadingBookings,
        fetchTripBookings,
        refreshTrips,
        refreshBookings,
        selectedTrip,
        setSelectedTrip,
      }}
    >
      {children}
    </AgentDashboardContext.Provider>
  );
};

export const useAgentDashboard = () => {
  const context = useContext(AgentDashboardContext);
  if (context === undefined) {
    throw new Error('useAgentDashboard must be used within an AgentDashboardProvider');
  }
  return context;
};
