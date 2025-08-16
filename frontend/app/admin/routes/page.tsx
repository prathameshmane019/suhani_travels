'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RouteForm } from '@/components/admin/routes/RouteForm';
import { RouteStopsView } from '@/components/admin/routes/RouteStopsView';
import { IRoute as RouteData , RouteFormData } from '@/types/route';
import { api } from '@/lib/utils';

const RoutesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewStopsOpen, setIsViewStopsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [routes, setRoutes] = useState<RouteData[]>([]);

  // Fetch routes from backend
  useEffect(() => {
    api.get('/routes')
      .then(res => setRoutes(res.data))
      .catch(() => console.error('Failed to fetch routes'));
  }, []);

  const handleAddRoute = async (data: RouteFormData) => {
    try {
      await api.post('/routes', data);
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch {
      console.error('Failed to add route');
    }
  };

  const handleEditRoute = async (data: RouteFormData) => {
    if (!selectedRoute) return;
    try {
      await api.put(`/routes/${selectedRoute._id}`, data);
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch {
      console.error('Failed to edit route');
    }
  };

  const handleDeleteRoute = async (id: string) => {
    try {
      await api.delete(`/routes/${id}`);
      setRoutes(routes => routes.filter(r => r._id !== id));
    } catch {
      console.error('Failed to delete route');
    }
  };
 

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Routes</h1>
          <p className="text-muted-foreground mt-2">Manage bus routes and schedules</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">All Routes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Route ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Route Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stops</th>
                 
                 
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routes.map((route) => (
                <tr key={route._id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm text-foreground">{route._id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{route.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                        {route.stops?.length || 0} stops
                      </span>
                      <button 
                        className="text-primary text-xs hover:underline"
                        onClick={() => {
                          setSelectedRoute(route);
                          setIsViewStopsOpen(true);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                   
                   
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => {
                          setSelectedRoute(route);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteRoute(route._id)}
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
          stops: (selectedRoute.stops || []).map(({  ...stop }) => stop),
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
          stops={selectedRoute.stops || []}
        />
      )}
    </div>
  );
};

export default RoutesPage;