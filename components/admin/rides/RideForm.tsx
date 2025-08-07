'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RideFormData, RideStop, RouteData } from '@/types/route';
import { Vehicle } from '@/types/vehicle';

interface RideFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RideFormData) => Promise<void>;
  routes: RouteData[];
  vehicles: Vehicle[];
  mode: 'create' | 'edit';
  initialData?: Partial<RideFormData>;
}

export function RideForm({ 
  open, 
  onClose, 
  onSubmit, 
  routes, 
  vehicles,
  mode,
  initialData 
}: RideFormProps) {
  const [formData, setFormData] = useState<RideFormData>({
    routeId: '',
    vehicleId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    stops: [],
    fare: 0
  });
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({ ...formData, ...initialData });
        const route = routes.find(r => r.id === initialData.routeId);
        if (route) setSelectedRoute(route);
      } else {
        setFormData({
          routeId: '',
          vehicleId: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          stops: [],
          fare: 0
        });
        setSelectedRoute(null);
      }
    }
  }, [open, initialData, routes]);

  useEffect(() => {
    if (selectedRoute) {
      const stops: Omit<RideStop, 'id'>[] = selectedRoute.stops.map(stop => ({
        ...stop,
        arrivalTime: null,
        departureTime: null
      }));
      setFormData(prev => ({
        ...prev,
        routeId: selectedRoute.id,
        stops
      }));
    }
  }, [selectedRoute]);

  const updateStopTime = (index: number, type: 'arrival' | 'departure', time: string) => {
    const newStops = [...formData.stops];
    if (type === 'arrival') {
      newStops[index].arrivalTime = time;
    } else {
      newStops[index].departureTime = time;
    }
    setFormData({ ...formData, stops: newStops });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit ride:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 flex flex-col">
        <div className="flex-none p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {mode === 'create' ? 'Schedule New Ride' : 'Edit Ride Schedule'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Select route, vehicle, and set timings for each stop
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Route</Label>
                  <Select
                    value={formData.routeId}
                    onValueChange={(value) => {
                      const route = routes.find(r => r.id === value);
                      setSelectedRoute(route || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(new Date(formData.date), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(formData.date)}
                        onSelect={(date) => date && setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Fare (₹)</Label>
                  <Input
                    type="number"
                    value={formData.fare}
                    onChange={(e) => setFormData({ ...formData, fare: parseFloat(e.target.value) })}
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
              </div>

              {selectedRoute && (
                <div className="space-y-4">
                  <Label>Stop Timings</Label>
                  <div className="space-y-4">
                    {formData.stops.map((stop, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "grid grid-cols-[1fr,1fr] gap-4 items-start p-4 rounded-lg border",
                          index === 0 && "bg-muted/50",
                          index === formData.stops.length - 1 && "bg-muted/50"
                        )}
                      >
                        <div className="space-y-2">
                          <div className="font-medium">{stop.name}</div>
                          <Input
                            type="time"
                            value={stop.arrivalTime || ''}
                            onChange={(e) => updateStopTime(index, 'arrival', e.target.value)}
                            disabled={index === 0}
                            required={index !== 0}
                          />
                          <div className="text-xs text-muted-foreground">Arrival Time</div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Platform</div>
                          <Input
                            type="time"
                            value={stop.departureTime || ''}
                            onChange={(e) => updateStopTime(index, 'departure', e.target.value)}
                            disabled={index === formData.stops.length - 1}
                            required={index !== formData.stops.length - 1}
                          />
                          <div className="text-xs text-muted-foreground">Departure Time</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-none p-6 border-t bg-background">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedRoute || !formData.vehicleId}
              >
                {isSubmitting ? (
                  <span className="mr-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </span>
                ) : null}
                {mode === 'create' ? 'Create Ride' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
