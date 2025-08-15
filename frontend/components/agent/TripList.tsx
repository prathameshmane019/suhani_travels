
'use client';
import React from 'react';

interface Trip {
  _id: string;
  bus: {
    busModel: string;
    registrationNumber: string;
  };
  date: string;
}

interface TripListProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onTripSelect: (trip: Trip) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, selectedTrip, onTripSelect }) => {
  return (
    <div className="lg:col-span-1 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Ongoing Trips</h2>
      {trips.length === 0 ? (
        <p>No ongoing trips found for you.</p>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm ${
                selectedTrip?._id === trip._id ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onTripSelect(trip)}
            >
              <p className="text-base font-medium text-gray-800">Bus: {trip.bus.busModel} ({trip.bus.registrationNumber})</p>
              <p className="text-sm text-gray-600">Date: {new Date(trip.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripList;
