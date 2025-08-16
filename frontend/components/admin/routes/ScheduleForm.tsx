'use client';

import { useState, useEffect } from 'react'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';  
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { DayOfWeek} from '@/types';
import { IRoute as RouteData } from '@/types/route';
import { Bus } from '@/types/';
import type { BusScheduleFormData } from '@/types/busSchedule';

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BusScheduleFormData) => Promise<void>;
  routes: RouteData[];
  vehicles: Bus[];
  mode: 'create' | 'edit';
  initialData?: Partial<BusScheduleFormData>;
}

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export function ScheduleForm({ 
  open, 
  onClose, 
  onSubmit, 
  routes, 
  vehicles,
  mode,
  initialData 
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<BusScheduleFormData>({
    routeId: '',
    busId: '',
    operatingDays: [],
    status: 'active',
    price: 0,
    startTime: '',
    endTime: '',
    stopTimings: [],
  });
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          routeId: initialData.routeId || '',
          busId: initialData.busId || '',
          operatingDays: initialData.operatingDays || [],
          status: initialData.status || 'active',
          price: initialData.price || 0,
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          stopTimings: initialData.stopTimings || [],
        });
        const route = routes.find(r => r._id === initialData.routeId);
        if (route) setSelectedRoute(route);
      } else {
        setFormData({
          routeId: '',
          busId: '',
          operatingDays: [],
          status: 'active',
          price:0,
          startTime: '',
          endTime: '',
          stopTimings: [],
        });
        setSelectedRoute(null);
      }
    }
  }, [open, initialData, routes]);

  useEffect(() => {
    if (selectedRoute) {
      const initialStopTimings = initialData?.stopTimings || [];
      setFormData(prev => ({
        ...prev,
        routeId: selectedRoute._id,
        stopTimings: selectedRoute.stops.map(stop => {
          const existingTiming = initialStopTimings.find(t => t.stopId === stop._id);
          return {
            stopId: stop._id || '',
            arrivalTime: existingTiming?.arrivalTime || '',
            departureTime: existingTiming?.departureTime || '',
          };
        }),
      }));
    }
  }, [selectedRoute, initialData]);

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStopTimingChange = (stopId: string, type: 'arrivalTime' | 'departureTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      stopTimings: prev.stopTimings.map(timing =>
        timing.stopId === stopId ? { ...timing, [type]: value } : timing
      ),
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.operatingDays.length === 0) {
      // TODO: Show error toast - need to select at least one day
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit schedule:', error);
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
              {mode === 'create' ? 'Create New Schedule' : 'Edit Schedule'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Set up recurring ride schedule with operating days and timings
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
                      const route = routes.find(r => r._id === value);
                      setSelectedRoute(route || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route._id} value={route._id}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bus</Label>
                  <Select
                    value={formData.busId}
                    onValueChange={(value) => setFormData({ ...formData, busId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((bus) => (
                        <SelectItem key={bus._id} value={bus._id}>
                          {bus.busModel} ({bus.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Operating Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.operatingDays.includes(day.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              operatingDays: [...formData.operatingDays, day.value]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              operatingDays: formData.operatingDays.filter(d => d !== day.value)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={day.value}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'cancelled') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              {selectedRoute && selectedRoute.stops.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Stop Timings</h3>
                  {selectedRoute.stops.map((stop) => {
                    const timing = formData.stopTimings.find(t => t.stopId === stop._id);
                    return (
                      <div key={stop._id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border p-4 rounded-md">
                        <p className="font-medium">{stop.name}</p>
                        <div className="space-y-2">
                          <Label htmlFor={`arrival-${stop._id}`}>Arrival Time</Label>
                          <Input
                            id={`arrival-${stop._id}`}
                            type="time"
                            value={timing?.arrivalTime || ''}
                            onChange={(e) => handleStopTimingChange(stop._id || '', 'arrivalTime', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`departure-${stop._id}`}>Departure Time</Label>
                          <Input
                            id={`departure-${stop._id}`}
                            type="time"
                            value={timing?.departureTime || ''}
                            onChange={(e) => handleStopTimingChange(stop._id || '', 'departureTime', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
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
                disabled={isSubmitting || !selectedRoute || !formData.busId || formData.operatingDays.length === 0}
              >
                {isSubmitting ? (
                  <span className="mr-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </span>
                ) : null}
                {mode === 'create' ? 'Create Schedule' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
