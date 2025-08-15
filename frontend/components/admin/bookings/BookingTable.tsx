'use client';

import { IBooking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface BookingsTableProps {
  bookings: IBooking[];
  onDelete: (id: string) => void;
}

export const BookingsTable = ({ bookings, onDelete }: BookingsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Booking ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Route</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Bus</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Travel Date</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-muted/50">
              <td className="px-6 py-4 text-sm text-foreground">{booking.bookingReference}</td>
              <td className="px-6 py-4 text-sm text-foreground">{booking.passengerDetails[0].name}</td>
              <td className="px-6 py-4 text-sm text-foreground">{typeof booking.tripId === 'object' && typeof booking.tripId.bus === 'object' ? booking.tripId.bus.busModel : 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-foreground">{new Date(booking.bookingDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm font-medium text-foreground">₹{booking.totalPrice.toLocaleString()}</td>
              <td className="px-6 py-4">
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(booking._id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
