'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BusCard } from '@/components/admin/buses/BusCard';
import { BusTable } from '@/components/admin/buses/BusTable';
import { BusFilters } from '@/components/admin/buses/BusFilters';
import { BusForm } from '@/components/admin/buses/BusForm';
import { Button } from '@/components/ui/button';

import { Bus, BusFormData, BusFilters as BusFiltersType } from '@/types/bus';

const mockBuses: Bus[] = [
    {
        id: 'bus-1',
        name: 'Volvo 9400',
        type: 'ac-sleeper',
        totalSeats: 40,
        amenities: ['AC', 'WiFi', 'USB'],
        price: 2500,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Add more mock buses here
];

import type { BusType, BusStatus } from '@/types';

interface FormData {
    name: string;
    type: BusType;
    totalSeats: number;
    amenities: string[];
    price: number;
    image: File | null;
    status: BusStatus;
}

import { ImageUpload } from '@/components/ui/image-upload';

const convertFormDataToBus = (data: FormData, imageUrl: string): Omit<Bus, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
        name: data.name,
        type: data.type,
        totalSeats: data.totalSeats,
        amenities: data.amenities,
        price: data.price,
        image: imageUrl,
        status: data.status
    };
};

const convertBusToFormData = (bus: Bus): FormData => {
    return {
        name: bus.name,
        type: bus.type,
        totalSeats: bus.totalSeats,
        amenities: bus.amenities,
        price: bus.price,
        image: null, // Cannot convert URL back to File
        status: bus.status
    };
};

const BusesPage = () => {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [buses, setBuses] = useState<Bus[]>(mockBuses);
    const [filters, setFilters] = useState<BusFiltersType>({
        search: '',
        type: 'all',
        status: 'all',
    });
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        type: 'ac-sleeper',
        totalSeats: 0,
        amenities: [],
        price: 0,
        image: null,
        status: 'active'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Convert File to URL if needed
            let imageUrl = '';
            if (formData.image) {
                // In a real app, this would be an API call to upload the image
                imageUrl = URL.createObjectURL(formData.image);
            }

            const busData: BusFormData = {
                ...formData,
                image: formData.image // Keep as File for API
            };

            await handleFormSubmit(busData);
            setIsAddModalOpen(false);
            setFormData({
                name: '',
                type: 'ac-sleeper',
                totalSeats: 0,
                amenities: [],
                price: 0,
                image: null,
                status: 'active'
            });
        } catch (error) {
            toast.error("Failed to submit form");
        }
    };

    const handleFormSubmit = async (data: BusFormData) => {
        try {
            if (formMode === 'create') {
                // In a real app, this would be an API call to upload the image
                let imageUrl = '';
                if (data.image) {
                    imageUrl = URL.createObjectURL(data.image);
                }

                const newBus: Bus = {
                    id: `bus-${Date.now()}`,
                    name: data.name,
                    type: data.type,
                    totalSeats: data.totalSeats,
                    amenities: data.amenities,
                    price: data.price,
                    status: data.status,
                    image: imageUrl,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setBuses([...buses, newBus]);
                toast.success("Bus created successfully");
            } else if (selectedBus) {
                // In a real app, this would be an API call to upload the image
                let imageUrl = selectedBus.image;
                if (data.image) {
                    imageUrl = URL.createObjectURL(data.image);
                }

                const updatedBuses = buses.map(bus =>
                    bus.id === selectedBus.id
                        ? {
                            ...bus,
                            name: data.name,
                            type: data.type,
                            totalSeats: data.totalSeats,
                            amenities: data.amenities,
                            price: data.price,
                            status: data.status,
                            image: imageUrl,
                            updatedAt: new Date()
                        }
                        : bus
                );
                setBuses(updatedBuses);
                toast.success("Bus updated successfully");
            }
            setIsFormOpen(false);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // In a real app, this would be an API call
            setBuses(buses.filter(bus => bus.id !== id));
            toast.success("Bus deleted successfully");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (bus: Bus) => {
        setSelectedBus(bus);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const filteredBuses = buses.filter(bus => {
        const matchesSearch = bus.name.toLowerCase().includes(filters.search.toLowerCase());
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
                            key={bus.id}
                            bus={bus}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <BusTable
                    buses={filteredBuses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Form Modal */}
            <BusForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedBus ? {
                    name: selectedBus.name,
                    type: selectedBus.type,
                    totalSeats: selectedBus.totalSeats,
                    amenities: selectedBus.amenities,
                    price: selectedBus.price,
                    status: selectedBus.status,
                    image: null // Can't convert URL back to File
                } : undefined}
                mode={formMode}
            />

            {/* Add/Edit Bus Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{formMode === 'create' ? 'Add New Bus' : 'Edit Bus'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Bus Image</Label>
                            <ImageUpload
                                label="Bus Image"
                                onChange={(file: File | null) => setFormData({ ...formData, image: file })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Bus Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Volvo 9400"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Bus Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: BusType) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ac-sleeper">AC Sleeper</SelectItem>
                                        <SelectItem value="non-ac-sleeper">Non-AC Sleeper</SelectItem>
                                        <SelectItem value="ac-seater">AC Seater</SelectItem>
                                        <SelectItem value="non-ac-seater">Non-AC Seater</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalSeats">Total Seats</Label>
                                <Input
                                    id="totalSeats"
                                    type="number"
                                    value={formData.totalSeats}
                                    onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                                    min={1}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price per Seat</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                min={0}
                                step={0.01}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Amenities</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {['AC', 'WiFi', 'USB', 'Water', 'Blanket', 'Charging Point'].map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity}`}
                                            checked={formData.amenities.includes(amenity)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setFormData({
                                                        ...formData,
                                                        amenities: [...formData.amenities, amenity]
                                                    });
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        amenities: formData.amenities.filter(a => a !== amenity)
                                                    });
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor={`amenity-${amenity}`}
                                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {amenity}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {formMode === 'create' ? 'Add Bus' : 'Update Bus'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BusesPage;
