
'use client';
import React from 'react';

interface Trip {
  _id: string;
  bus: {
    busModel: string;
    registrationNumber: string;
  };
  date: string;
  pickupPoints: string[];
  dropPoints: string[];
}

interface TripDetailsProps {
  trip: Trip | null;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  return (
    <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
      {trip ? (
        <>
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
            <h3 className="font-bold text-lg mb-2">Selected Trip Details:</h3>
            <p className="text-base">Bus: {trip.bus.busModel} ({trip.bus.registrationNumber})</p>
            <p className="text-base">Date: {new Date(trip.date).toLocaleDateString()}</p>
            <p className="text-base">Pickup Points: {trip.pickupPoints.join(', ')}</p>
            <p className="text-base">Drop Points: {trip.dropPoints.join(', ')}</p>
          </div>
          <p className="text-gray-600">View passenger details and manage bookings on the Passenger Details page.</p>
        </>
      ) : (
        <p className="text-gray-600">Select a trip from the left to view its details.</p>
      )}
    </div>
  );
};

export default TripDetails;
