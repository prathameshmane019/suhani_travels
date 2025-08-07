'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Stop } from '@/types/route';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RouteFormData } from '@/types/route';
import { cn } from '@/lib/utils';

interface RouteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RouteFormData) => Promise<void>;
  initialData?: Partial<RouteFormData>;
  mode: 'create' | 'edit';
}

const defaultFormData: RouteFormData = {
  name: '',
  stops: [
    { name: '', sequence: 0, arrivalTime: null, departureTime: null },
    { name: '', sequence: 1, arrivalTime: null, departureTime: null }
  ],
  distance: 0,
  status: 'active',
};

export function RouteForm({ open, onClose, onSubmit, initialData, mode }: RouteFormProps) {
  const [formData, setFormData] = useState<RouteFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...defaultFormData, ...initialData } : defaultFormData);
    }
  }, [open, initialData]);

  const addStop = () => {
    setFormData({
      ...formData,
      stops: [
        ...formData.stops,
        {
          name: '',
          sequence: formData.stops.length,
          arrivalTime: null,
          departureTime: null
        }
      ]
    });
  };

  const removeStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    // Update sequences after removal
    newStops.forEach((stop, i) => {
      stop.sequence = i;
    });
    setFormData({
      ...formData,
      stops: newStops
    });
  };

  const updateStop = (index: number, field: keyof Omit<Stop, 'id'>, value: string | number | null) => {
    const newStops = [...formData.stops];
    newStops[index] = {
      ...newStops[index],
      [field]: value
    };
    setFormData({
      ...formData,
      stops: newStops
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit route:', error);
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
              {mode === 'create' ? 'Add New Route' : 'Edit Route'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Add stops and their timings to create a route
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mumbai - Delhi Express Route"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Stops</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addStop}
                      disabled={formData.stops.length >= 10}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Stop
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.stops.map((stop, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "grid grid-cols-[1fr,1fr,auto] gap-4 items-start p-4 rounded-lg border",
                          index === 0 && "bg-muted/50",
                          index === formData.stops.length - 1 && "bg-muted/50"
                        )}
                      >
                        <div className="space-y-2">
                          <Label htmlFor={`stop-${index}`}>Stop Name</Label>
                          <Input
                            id={`stop-${index}`}
                            value={stop.name}
                            onChange={(e) => updateStop(index, 'name', e.target.value)}
                            placeholder={index === 0 ? "Starting Point" : index === formData.stops.length - 1 ? "End Point" : `Stop ${index + 1}`}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor={`arrival-${index}`}>Arrival</Label>
                            <Input
                              id={`arrival-${index}`}
                              type="time"
                              value={stop.arrivalTime || ''}
                              onChange={(e) => updateStop(index, 'arrivalTime', e.target.value)}
                              disabled={index === 0}
                              required={index !== 0}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`departure-${index}`}>Departure</Label>
                            <Input
                              id={`departure-${index}`}
                              type="time"
                              value={stop.departureTime || ''}
                              onChange={(e) => updateStop(index, 'departureTime', e.target.value)}
                              disabled={index === formData.stops.length - 1}
                              required={index !== formData.stops.length - 1}
                            />
                          </div>
                        </div>
                        <div className="pt-8">
                          {formData.stops.length > 2 && index !== 0 && index !== formData.stops.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStop(index)}
                              className="text-slate-500 hover:text-rose-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Total Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                      min={0}
                      step={0.1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="mr-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </span>
                ) : null}
                {mode === 'create' ? 'Create Route' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
