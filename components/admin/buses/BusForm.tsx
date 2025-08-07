'use client';

import { BusFormData, BusStatus } from "@/types/bus";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface BusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BusFormData) => void;
  initialData?: Partial<BusFormData>;
  mode: 'create' | 'edit';
}

const defaultFormData: BusFormData = {
  name: '',
  type: 'ac-sleeper',
  totalSeats: 40,
  amenities: [],
  image: null,
  price: 0,
  status: 'active',
};

const amenitiesList = ['AC', 'WiFi', 'USB', 'Water', 'Blanket', 'Charging Point'];

export function BusForm({ open, onClose, onSubmit, initialData, mode }: BusFormProps) {
  const [formData, setFormData] = useState<BusFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...defaultFormData, ...initialData } : defaultFormData);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 flex flex-col">
        <div className="flex-none p-6 border-b">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">
              {mode === 'create' ? 'Add New Bus' : 'Edit Bus'}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fill in the information below to {mode === 'create' ? 'add a new' : 'update the'} bus.
            </p>
          </DialogHeader>
        </div>

        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
              await handleSubmit(e);
            } finally {
              setIsSubmitting(false);
            }
          }} 
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                {/* Left column - Main details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Bus Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Volvo 9400"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-base">Bus Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as BusFormData['type'] })}
                      >
                        <SelectTrigger id="type" className="h-11">
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
                      <Label htmlFor="status" className="text-base">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as BusStatus })}
                      >
                        <SelectTrigger id="status" className="h-11">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalSeats" className="text-base">Total Seats</Label>
                      <Input
                        id="totalSeats"
                        type="number"
                        value={formData.totalSeats || ''}
                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value ? parseInt(e.target.value) : 0 })}
                        min={1}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base">Price per Seat</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                        min={0}
                        step={0.01}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                      {amenitiesList.map((amenity) => (
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
                </div>

                {/* Right column - Image upload */}
                <div className="space-y-2">
                  <Label className="text-base">Bus Image</Label>
                  <div className="h-[300px] relative">
                    <ImageUpload
                      label="Upload bus image"
                      onChange={(file) => setFormData({ ...formData, image: file })}
                      value={formData.image ? (typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)) : undefined}
                      className="h-full"
                    />
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
                onClick={handleModalClose}
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
                {mode === 'create' ? 'Add Bus' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )};