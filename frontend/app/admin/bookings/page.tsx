'use client';

import { useState, useEffect, useMemo } from 'react';
import { Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { BookingsTable } from '@/components/admin/bookings/BookingTable';
import { Button } from '@/components/ui/button';
import { IBooking } from '@/types/booking';
import { api } from '@/lib/utils';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    status: 'all',
  });

  useEffect(() => {
    api.get('/bookings')
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to fetch bookings'));

  }, []);

         console.log('Fetched bookings:', bookings); 
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const statusMatch = filters.status === 'all' || booking.status === filters.status;
      // Add date range filtering logic here
      return statusMatch;
    });
  }, [bookings, filters]);

  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
  }, [filteredBookings]);

  const totalBookings = filteredBookings.length;
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const handleExport = () => {
    // Implement CSV export logic
    toast.info('Exporting report...');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings & Revenue</h1>
          <p className="text-muted-foreground mt-2">View and manage bookings and revenue reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-5 h-5" />
            Select Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Total Revenue</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Total Bookings</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalBookings}</p>
        </div>
        
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Average Booking Value</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">₹{averageBookingValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Recent Bookings</h2>
        </div>
        <BookingsTable bookings={filteredBookings} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BookingsPage;


