'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { RouteForm } from '@/components/admin/routes/RouteForm';
import { RouteStopsView } from '@/components/admin/routes/RouteStopsView';
import { RouteData, RouteFormData } from '@/types/route';

const RoutesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewStopsOpen, setIsViewStopsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  const handleAddRoute = async (data: RouteFormData) => {
    // TODO: Implement API call to add route
    console.log('Adding route:', data);
  };

  const handleEditRoute = async (data: RouteFormData) => {
    // TODO: Implement API call to edit route
    console.log('Editing route:', data);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Routes</h1>
          <p className="text-slate-500 mt-2">Manage bus routes and schedules</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Route
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">All Routes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Route ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Route Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Stops</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Distance</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">First Departure</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Last Arrival</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">RT{String(index + 1).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Mumbai - Pune - Bangalore Express</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        3 stops
                      </span>
                      <button 
                        className="text-blue-600 text-xs hover:underline"
                        onClick={() => {
                          setSelectedRoute({
                            id: `RT${String(index + 1).padStart(4, '0')}`,
                            name: 'Mumbai - Pune - Bangalore Express',
                            stops: [
                              { id: '1', name: 'Mumbai', sequence: 0, arrivalTime: null, departureTime: '06:00' },
                              { id: '2', name: 'Pune', sequence: 1, arrivalTime: '09:00', departureTime: '09:15' },
                              { id: '3', name: 'Bangalore', sequence: 2, arrivalTime: '22:30', departureTime: null }
                            ],
                            distance: 1400,
                            status: 'active'
                          });
                          setIsViewStopsOpen(true);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">1,400 km</td>
                  <td className="px-6 py-4 text-sm text-slate-600">06:00 AM</td>
                  <td className="px-6 py-4 text-sm text-slate-600">10:30 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="text-slate-600 hover:text-emerald-600"
                        onClick={() => {
                          setSelectedRoute({
                            id: `RT${String(index + 1).padStart(4, '0')}`,
                            name: 'Mumbai - Pune - Bangalore Express',
                            stops: [
                              { id: '1', name: 'Mumbai', sequence: 0, arrivalTime: null, departureTime: '06:00' },
                              { id: '2', name: 'Pune', sequence: 1, arrivalTime: '09:00', departureTime: '09:15' },
                              { id: '3', name: 'Bangalore', sequence: 2, arrivalTime: '22:30', departureTime: null }
                            ],
                            distance: 1400,
                            status: 'active'
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
                          console.log('Delete route:', `RT${String(index + 1).padStart(4, '0')}`);
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

      {/* Add Route Modal */}
      <RouteForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRoute}
        mode="create"
      />

      {/* Edit Route Modal */}
      <RouteForm
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRoute(null);
        }}
        onSubmit={handleEditRoute}
        initialData={selectedRoute ? {
          name: selectedRoute.name,
          stops: selectedRoute.stops.map(({ id, ...stop }) => stop),
          distance: selectedRoute.distance,
          status: selectedRoute.status,
          description: selectedRoute.description,
        } : undefined}
        mode="edit"
      />

      {/* View Stops Modal */}
      {selectedRoute && (
        <RouteStopsView
          open={isViewStopsOpen}
          onClose={() => {
            setIsViewStopsOpen(false);
            setSelectedRoute(null);
          }}
          routeName={selectedRoute.name}
          stops={selectedRoute.stops}
        />
      )}
    </div>
  );
};

export default RoutesPage;
