'use client';

import { IBooking } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface BookingListProps {
  bookings: IBooking[];
}

export const BookingList = ({ bookings }: BookingListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <Card key={booking._id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Booking ID: {booking.bookingReference}</CardTitle>
            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
              {booking.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Route:</span> {typeof booking.tripId === 'object' && booking.tripId.route.stops && booking.tripId.route.stops.length > 0 ? `${booking.tripId.route.stops[0]?.name} - ${booking.tripId.route.stops[booking.tripId.route.stops.length - 1]?.name}` : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Travel Date:</span> {typeof booking.tripId === 'object' ? new Date(booking.tripId.date).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Seats:</span> {booking.seatNumbers.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Total Price:</span> {formatPrice(booking.totalPrice)}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Booked On:</span> {new Date(booking.bookingDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
