'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { ITrip as Trip} from '@/types'; // Added Trip import

interface NewBookingData {
  seatNumbers: string;
  passengerName: string;
  passengerGender: 'male' | 'female' | 'other';
  passengerPhone: string;
  passengerEmail: string;
  totalPrice: string; 
  paymentMethod: string;
  boardingPointName: string;
  boardingPointSequence: string;
  dropoffPointName: string;
  dropoffPointSequence: string;
}

interface NewBookingFormProps {
  newBookingData: NewBookingData;
  handleNewBookingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean; } }) => void;
  handleNewBookingSubmit: (e: React.FormEvent) => void;
  setShowNewBookingForm: (show: boolean) => void;
  selectedTrip: Trip;
  isAgent: boolean;
}

const NewBookingForm: React.FC<NewBookingFormProps> = ({ newBookingData, handleNewBookingChange, handleNewBookingSubmit, setShowNewBookingForm, selectedTrip, isAgent }) => {
  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Create New Booking</h3>
      <form onSubmit={handleNewBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seatNumbers">Seat Numbers (comma-separated)</Label>
          <Input
            type="text"
            name="seatNumbers"
            id="seatNumbers"
            value={newBookingData.seatNumbers}
            onChange={handleNewBookingChange}
            placeholder="e.g., A1, A2"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengerName">Passenger Name</Label>
          <Input
            type="text"
            name="passengerName"
            id="passengerName"
            value={newBookingData.passengerName}
            onChange={handleNewBookingChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengerGender">Gender</Label>
          <Select onValueChange={(value) => handleNewBookingChange({ target: { name: 'passengerGender', value } })} value={newBookingData.passengerGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengerPhone">Phone</Label>
          <Input
            type="text"
            name="passengerPhone"
            id="passengerPhone"
            value={newBookingData.passengerPhone}
            onChange={handleNewBookingChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalPrice">Total Price</Label>
          <Input
            type="number"
            name="totalPrice"
            id="totalPrice" 
            value={selectedTrip.price}
            onChange={handleNewBookingChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select onValueChange={(value) => handleNewBookingChange({ target: { name: 'paymentMethod', value } })} value={newBookingData.paymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              {isAgent && <SelectItem value="cash">Cash</SelectItem>}
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="debit_card">Debit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="boardingPointName">Boarding Point</Label>
          <Select onValueChange={(value) => handleNewBookingChange({ target: { name: 'boardingPointName', value } })} value={newBookingData.boardingPointName}>
            <SelectTrigger>
              <SelectValue placeholder="Select Boarding Point" />
            </SelectTrigger>
            <SelectContent>
              {selectedTrip?.route.stops.map((point: { name: string; sequence: number }) => (
                <SelectItem key={point.name} value={point.name}>{point.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dropoffPointName">Drop-off Point</Label>
          <Select onValueChange={(value) => handleNewBookingChange({ target: { name: 'dropoffPointName', value } })} value={newBookingData.dropoffPointName}>
            <SelectTrigger>
              <SelectValue placeholder="Select Drop-off Point" />
            </SelectTrigger>
            <SelectContent>
              {selectedTrip?.route.stops.map((point: { name: string; sequence: number }) => (
                <SelectItem key={point.name} value={point.name}>{point.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setShowNewBookingForm(false)}>
            Cancel
          </Button>
          <Button type="submit">
            Create Booking
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewBookingForm;