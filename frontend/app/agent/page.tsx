'use client';
import React from 'react';
import { useAgentDashboard } from '@/lib/AgentDashboardContext';
import { useRouter } from 'next/navigation';
import TripList from '@/components/agent/TripList';
import TripDetails from '@/components/agent/TripDetails';
import { ITrip } from '@/types';

const AgentTripsPage = () => {
  const { ongoingTrips, loadingTrips, selectedTrip, setSelectedTrip } = useAgentDashboard();
  const router = useRouter();

  const handleTripSelect = (trip: ITrip) => {
    setSelectedTrip(trip);
    router.push(`/agent/${trip._id}`);
  };

  if (loadingTrips) {
    return <p>Loading trips...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TripList trips={ongoingTrips} selectedTrip={selectedTrip} onTripSelect={handleTripSelect} />
      <TripDetails trip={selectedTrip} />
    </div>
  );
};

export default AgentTripsPage;