"use client";
import { useState, useEffect, useCallback } from 'react';
import {
  Bus, 
  Clock,
  MapPin,
  User,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Ticket,
  Users,
  RefreshCw
} from 'lucide-react';
import { api } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import { IUser } from '@/types/user';

interface ApiBooking {
  _id: string;
  bookingReference: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  totalPrice: number;
  paymentStatus: 'completed' | 'pending';
  seatNumbers: string[];
  passengerDetails: {
    name: string;
    phone: string;
    email?: string;
  }[];
  tripId: {
    _id: string;
    date: string;
    bus: {
      registrationNumber: string;
      model: string;
      type: string;
    };
    route: {
      from: string;
      to: string;
      duration: string;
    };
    schedule: {
      endTime: string;
      startTime: string;
    };
  };
}

// Type Definitions
interface IBooking {
  _id: string;
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  seats: string[];
  passenger: {
    name: string;
    phone: string;
    email?: string;
  };
  bus: {
    registrationNumber: string;
    model: string;
    type: string;
  };
  route: {
    from: string;
    to: string;
    duration: string;
  };
  schedule: {
    endTime: string;
    startTime: string;
  };
  tripId: {
    _id: string;
    date: string;
  };
}

// BookingCard Component
const BookingCard = ({
  booking,
  onViewDetails,
  onCancelBooking
}: {
  booking: IBooking;
  onViewDetails: (booking: IBooking) => void;
  onCancelBooking: (booking: IBooking) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Booking #{booking.bookingId}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)} flex items-center gap-1`}>
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

              </div>
              <p className="text-gray-600 text-sm">
                Booked on {formatDate(booking.bookingDate)}
              </p>
            </div>
          </div>

        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(booking.schedule.startTime)}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{booking.route.from}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(booking.travelDate)}
              </div>
            </div>

            <div className="flex-1 px-4">
              <div className="relative">
                <div className="h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-3 py-1 rounded-full border-2 border-blue-400 text-sm font-medium text-blue-700">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {booking.route.duration}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(booking.schedule.endTime)}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{booking.route.to}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Bus Details</h4>
              <p className="text-gray-900 font-medium">{booking.bus.registrationNumber}</p>
              <p className="text-sm text-gray-600">{booking.bus.model}</p>
              <p className="text-xs text-blue-600 mt-1 capitalize">{booking.bus.type.replace('-', ' ')}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Passenger Details</h4>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                {booking.passenger.name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {booking.passenger.phone}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Booking Info</h4>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">
                Seats: {booking.seats.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Total Amount</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹{booking.totalAmount.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Status</div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
                }`}>
                {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {booking.status === 'confirmed' && new Date(booking.tripId.date) > new Date() && (
              <button
                onClick={() => onCancelBooking(booking)}
                className="px-6 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition-colors border border-red-200"
              >
                Cancel Booking
              </button>
            )}

            <button
              onClick={() => onViewDetails(booking)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main BookingsPage Component
const BookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const bookingsPerPage = 10;
  const [user, setUser] = useState<IUser>({} as IUser);


  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await api.get('/auth/me'); // Assuming this endpoint exists

          const userData = response.data.user;
          console.log('User data fetched:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Optionally show a toast error
        }
      };
      fetchUserData();
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!user.phone) return;

    setLoading(true);
    try {
      const response = await api.get('/bookings/by-mobile', {
        params: {
          mobile: user.phone?.replace(/\D/g, ''),
          page,
          limit: bookingsPerPage
        }
      });
      console.log(response.data);
      const mappedBookings = response.data.bookings.map((b: ApiBooking) => ({
        _id: b._id,
        bookingId: b.bookingReference,
        status: b.status,
        bookingDate: b.bookingDate,
        travelDate: b.tripId.date,
        totalAmount: b.totalPrice,
        paymentStatus: b.paymentStatus === 'completed' ? 'paid' : 'pending',
        seats: b.seatNumbers,
        passenger: b.passengerDetails[0],
        bus: b.tripId.bus,
        route: b.tripId.route,
        schedule: b.tripId.schedule,
        tripId: {
          _id: b.tripId._id,
          date: b.tripId.date
        },
      }));

      setTotalPages(response.data.totalPages || 1);
      setBookings(mappedBookings);
      setError(null);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, page]);


  useEffect(() => {
    if (user.phone) {
      fetchBookings();
    }
  }, [user.phone, page, fetchBookings]);

  const handleViewDetails = (booking: IBooking) => {
    router.push(`/bookings/${booking._id}?mobile=${encodeURIComponent(user.phone || '')}`);
  };




  const handleCancelBooking = async (booking: IBooking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        await api.patch(`/bookings/${booking._id}/cancel`, { mobile: user.phone?.replace(/\D/g, '') });
        await fetchBookings();
        setError(null);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const filterBookings = (bookings: IBooking[]) => {
    let filtered = [...bookings];

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.route.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(booking => {
        const travelDate = new Date(booking.travelDate);
        switch (dateFilter) {
          case 'upcoming':
            return travelDate >= now;
          case 'past':
            return travelDate < now;
          case 'this-month':
            return travelDate.getMonth() === now.getMonth() && travelDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;

    return { total, confirmed, completed, pending };
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <Ticket className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-6">Loading your bookings...</p>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to load bookings</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{error}</p>
      <button
        onClick={fetchBookings}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
        <Ticket className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookings found</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
          ? "Try adjusting your filters to see more results."
          : "No bookings found for this mobile number. Try another number or book a new trip!"
        }
      </p>
      <button
        onClick={() => router.push('/trips')}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
      >
        Book a Trip
      </button>
    </div>
  );

  const filteredBookings = filterBookings(bookings);
  
  return ( 
    <div className="min-h-screen dotted-background">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage and track all your bus reservations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">


        {/* Filters */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by booking ID, route, or passenger name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="this-month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay />
        ) : bookings?.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onViewDetails={handleViewDetails}
                  onCancelBooking={handleCancelBooking}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-center pt-8 mt-8 border-t border-gray-200">
              <p className="text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </p>
            </div>
          </>
        )}


      </div>
    </div>
  );
};

export default BookingsPage;