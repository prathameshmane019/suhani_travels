"use client"
import { BarChart3, Users, Bus, IndianRupee, TrendingUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { IBooking } from '@/types/booking';
import { IRoute } from '@/types/route';

const StatCard = ({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change?: string }) => (
  <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-muted-foreground font-medium">{label}</h3>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <span className="text-sm font-medium text-primary flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, routesRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/routes'),
        ]);
        setBookings(bookingsRes.data);
        setRoutes(routesRes.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = useMemo(() => {
    return bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
  }, [bookings]);

  const totalBookings = bookings.length;
  const activeRoutes = routes.length;

  // Placeholder for Occupancy Rate - requires more complex logic involving trips and bus capacities
  const occupancyRate = "N/A"; 

  const recentBookings = useMemo(() => {
    return bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()).slice(0, 5);
  }, [bookings]);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<IndianRupee className="w-6 h-6 text-primary" />}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-primary" />}
          label="Total Bookings"
          value={totalBookings.toLocaleString()}
        />
        <StatCard
          icon={<Bus className="w-6 h-6 text-primary" />}
          label="Active Routes"
          value={activeRoutes.toLocaleString()}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-primary" />}
          label="Occupancy Rate"
          value={occupancyRate}
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Route</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm text-foreground">{booking.bookingReference}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{booking.passengerDetails[0].name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground">₹{booking.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
