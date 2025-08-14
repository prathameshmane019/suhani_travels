import { ITrip } from "@/types/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingSummaryCardProps {
  trip: ITrip;
  selectedSeats: string[];
  bookingInProgress: boolean;
  onBooking: () => void;
}

export const BookingSummaryCard = ({ trip, selectedSeats, bookingInProgress, onBooking }: BookingSummaryCardProps) => {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-muted-foreground font-medium">Selected Seats:</span>
            <p className="font-bold text-primary text-lg break-words">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
            </p>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-foreground font-bold text-lg">Total Price:</span>
            <span className="text-3xl font-extrabold text-green-600">
              ${(selectedSeats.length * (trip.price ?? 0)).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button
            onClick={onBooking}
            disabled={selectedSeats.length === 0 || bookingInProgress}
            className="w-full"
            size="lg"
          >
            {bookingInProgress ? "Processing..." : `Book ${selectedSeats.length} Seat(s)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};