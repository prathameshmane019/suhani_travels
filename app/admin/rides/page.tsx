'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { RideForm } from '@/components/admin/rides/RideForm';
import { RideData, RideFormData, RouteData } from '@/types/route';
import { Vehicle } from '@/types/vehicle';
import { format } from 'date-fns';

const RidesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideData | null>(null);

  // TODO: Replace with actual API calls
  const routes: RouteData[] = [{
    id: 'RT0001',
    name: 'Mumbai - Pune - Bangalore Express',
    stops: [
      { id: '1', name: 'Mumbai', sequence: 0, distanceFromLast: 0, expectedDuration: 180 },
      { id: '2', name: 'Pune', sequence: 1, distanceFromLast: 150, expectedDuration: 780 },
      { id: '3', name: 'Bangalore', sequence: 2, distanceFromLast: 1250, expectedDuration: 0 }
    ],
    totalDistance: 1400,
    status: 'active'
  }];

  const vehicles: Vehicle[] = [{
    id: 'BUS0001',
    registrationNumber: 'MH01AB1234',
    name: 'Volvo 9400',
    type: 'ac-sleeper',
    totalSeats: 40,
    amenities: ['AC', 'WiFi', 'USB'],
    status: 'active'
  }];

  const handleAddRide = async (data: RideFormData) => {
    // TODO: Implement API call to add ride
    console.log('Adding ride:', data);
  };

  const handleEditRide = async (data: RideFormData) => {
    // TODO: Implement API call to edit ride
    console.log('Editing ride:', data);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rides</h1>
          <p className="text-slate-500 mt-2">Schedule and manage bus rides</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule New Ride
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">All Rides</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Ride ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Route</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Vehicle</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Departure</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Arrival</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">RD{String(index + 1).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Mumbai - Pune - Bangalore Express</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Volvo 9400 (MH01AB1234)</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Aug 8, 2025</td>
                  <td className="px-6 py-4 text-sm text-slate-600">06:00 AM</td>
                  <td className="px-6 py-4 text-sm text-slate-600">10:30 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Scheduled
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="text-slate-600 hover:text-emerald-600"
                        onClick={() => {
                          setSelectedRide({
                            id: `RD${String(index + 1).padStart(4, '0')}`,
                            routeId: 'RT0001',
                            vehicleId: 'BUS0001',
                            date: '2025-08-08',
                            stops: [
                              { 
                                id: '1', 
                                name: 'Mumbai', 
                                sequence: 0, 
                                distanceFromLast: 0,
                                expectedDuration: 180,
                                arrivalTime: null, 
                                departureTime: '06:00' 
                              },
                              { 
                                id: '2', 
                                name: 'Pune', 
                                sequence: 1, 
                                distanceFromLast: 150,
                                expectedDuration: 780,
                                arrivalTime: '09:00', 
                                departureTime: '09:15' 
                              },
                              { 
                                id: '3', 
                                name: 'Bangalore', 
                                sequence: 2, 
                                distanceFromLast: 1250,
                                expectedDuration: 0,
                                arrivalTime: '22:30', 
                                departureTime: null 
                              }
                            ],
                            status: 'scheduled',
                            fare: 1500,
                            availableSeats: 35
                          });
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-slate-600 hover:text-rose-600"
                        onClick={() => {
                          // TODO: Implement delete confirmation
                          console.log('Delete ride:', `RD${String(index + 1).padStart(4, '0')}`);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Ride Modal */}
      <RideForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRide}
        routes={routes}
        vehicles={vehicles}
        mode="create"
      />

      {/* Edit Ride Modal */}
      <RideForm
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRide(null);
        }}
        onSubmit={handleEditRide}
        routes={routes}
        vehicles={vehicles}
        mode="edit"
        initialData={selectedRide ? {
          routeId: selectedRide.routeId,
          vehicleId: selectedRide.vehicleId,
          date: selectedRide.date,
          stops: selectedRide.stops.map(({ id, ...stop }) => stop),
          fare: selectedRide.fare
        } : undefined}
      />
    </div>
  );
};

export default RidesPage;
