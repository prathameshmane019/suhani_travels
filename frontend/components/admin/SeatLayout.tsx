'use client';

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  number: string;
  type: 'regular' | 'premium';
  isBooked: boolean;
  price: number;
}

interface SeatLayoutProps {
  seats: Seat[];
  onSeatUpdate: (seat: Seat) => void;
  editable?: boolean;
}

export const SeatLayout = ({ seats, onSeatUpdate, editable = false }: SeatLayoutProps) => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  
  const handleSeatClick = (seat: Seat) => {
    if (!editable && seat.isBooked) return;
    setSelectedSeat(seat);
  };

  const handleSeatTypeChange = (type: 'regular' | 'premium') => {
    if (selectedSeat && editable) {
      const updatedSeat = { ...selectedSeat, type };
      onSeatUpdate(updatedSeat);
      setSelectedSeat(updatedSeat);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
              seat.isBooked && "bg-secondary text-secondary-foreground cursor-not-allowed",
              !seat.isBooked && seat.type === 'premium' && "bg-primary/20 text-primary hover:bg-primary/30",
              !seat.isBooked && seat.type === 'regular' && "bg-background border border-input text-foreground hover:border-primary",
              selectedSeat?.id === seat.id && "ring-2 ring-ring ring-offset-2"
            )}
            disabled={!editable && seat.isBooked}
          >
            {seat.number}
          </button>
        ))}
      </div>

      {selectedSeat && editable && (
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium text-foreground mb-4">Seat {selectedSeat.number} Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Seat Type</Label>
              <RadioGroup
                value={selectedSeat.type}
                onValueChange={(value: 'regular' | 'premium') => handleSeatTypeChange(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={selectedSeat.price}
                onChange={(e) => {
                  const updatedSeat = { ...selectedSeat, price: parseFloat(e.target.value) };
                  onSeatUpdate(updatedSeat);
                  setSelectedSeat(updatedSeat);
                }}
                min={0}
                step={0.01}
              />
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-background border border-input rounded"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/20 rounded"></div>
          <span className="text-muted-foreground">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary rounded"></div>
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
    </div>
  );
};
