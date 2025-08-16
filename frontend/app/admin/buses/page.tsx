'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react'; 
import { toast } from 'sonner';
import { BusCard } from '@/components/admin/buses/BusCard';
import { BusTable } from '@/components/admin/buses/BusTable';
import { BusFilters } from '@/components/admin/buses/BusFilters';
import { BusForm } from '@/components/admin/buses/BusForm';
import { Button } from '@/components/ui/button';

import { Bus, BusFormData, BusFilters as BusFiltersType } from '@/types';
import { api } from '@/lib/utils';


// No local form state here; using `BusForm` modal component

const BusesPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [buses, setBuses] = useState<Bus[]>([]);
    const [filters, setFilters] = useState<BusFiltersType>({
        search: '',
        type: 'all',
        status: 'all',
    });
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Fetch buses from backend
    useEffect(() => {
        api.get('/buses')
            .then(res => {
                setBuses(res.data);
            })
            .catch(() => toast.error('Failed to fetch buses'));
    }, []);

    // All submit handled inside BusForm -> handleFormSubmit

    const handleFormSubmit = async (data: BusFormData) => {
        try {
            // Build multipart form data for image upload
            const form = new FormData();
            form.append('busModel', data.busModel);
            form.append('registrationNumber', data.registrationNumber);
            form.append('type', data.type);
            form.append('seats', String(data.seats));
            form.append('status', data.status);
            if (data.amenities && data.amenities.length) {
                // Backend can parse CSV or repeated keys; using CSV here
                form.append('amenities', data.amenities.join(','));
            }
            if (data.image instanceof File) {
                form.append('image', data.image);
            }
            if (data.seatLayout) {
                form.append('seatLayout', JSON.stringify(data.seatLayout));
            }
            if (data.agentPassword) {
                form.append('agentPassword', data.agentPassword);
            }
            console.log(form);
            // If editing, update; else, create
            if (formMode === 'edit' && selectedBus) {
                await api.put(`/buses/${selectedBus._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Bus updated');
            } else {
                await api.post('/buses', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Bus created');
            }
            // Refresh list
            const res = await api.get('/buses');
            setBuses(res.data);
            setIsFormOpen(false);
        } catch (error) {
            toast.error('Failed to save bus');
            console.log(error);
        }
    };

    const handleDeleteBus = async (_id: string) => {
        try {
            await api.delete(`/buses/${_id}`);
            setBuses(buses => buses.filter(b => b._id !== _id));
            toast.success('Bus deleted');
        } catch (error) {
            toast.error('Failed to delete bus');
            console.log(error);
        }
    };

    const handleEdit = (bus: Bus) => {
        setSelectedBus(bus);
        console.log(bus);

        setFormMode('edit');
        setIsFormOpen(true);
    };

    const filteredBuses = buses.filter(bus => {
        const matchesSearch = bus.busModel.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = !filters.type || filters.type === 'all' || bus.type === filters.type;
        const matchesStatus = !filters.status || filters.status === 'all' || bus.status === filters.status;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Buses</h1>
                    <p className="text-muted-foreground mt-2">Manage bus details and seat layouts</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="px-3"
                        >
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="px-3"
                        >
                            Table
                        </Button>
                    </div>
                    <Button
                        onClick={() => {
                            setFormMode('create');
                            setSelectedBus(null);
                            setIsFormOpen(true);
                        }}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add New Bus</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <BusFilters
                filters={filters}
                onFilterChange={setFilters}
            />

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBuses.map((bus) => (
                        <BusCard
                            key={bus._id}
                            bus={bus}
                            onEdit={handleEdit}
                            onDelete={handleDeleteBus}
                        />
                    ))}
                </div>
            ) : (
                <BusTable
                    buses={filteredBuses}
                    onEdit={handleEdit}
                    onDelete={handleDeleteBus}
                />
            )}

            {/* Form Modal */}
            <BusForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedBus ? {
                    busModel: selectedBus.busModel,
                    registrationNumber: selectedBus.registrationNumber,
                    type: selectedBus.type,
                    seats: selectedBus?.seatLayout?.totalSeats,
                    amenities: selectedBus.amenities,
                    status: selectedBus.status,
                    seatLayout: selectedBus.seatLayout,
                  image: null,
                    agentPassword: '',
                } : undefined}
                mode={formMode}
              existingImageUrl={selectedBus?.image}
            />
        </div>
    );
};

export default BusesPage;