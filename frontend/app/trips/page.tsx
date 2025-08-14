"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ITrip } from '@/types/trip';
import { api } from '@/lib/utils';
import BusCard from '@/components/BusCard';
import { AlertCircle, Calendar, MapPin, Filter, SortAsc, ChevronLeft, ChevronRight, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/SearchForm';

interface TripsResponse {
  trips: ITrip[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTrips: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const TripsPage = () => {
  const searchParams = useSearchParams();
  const [tripsData, setTripsData] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState<'all' | 'ac' | 'available'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'rating'>('time');

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const router =useRouter();
  useEffect(() => {
    const fetchTrips = async () => {
      if (!from || !to || !date) {
        setError("Missing search parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&page=${currentPage}&limit=10`);
        
        if (response.data) {
          setTripsData(response.data);
        } else {
          setTripsData({ 
            trips: [], 
            pagination: { 
              currentPage: 1, 
              totalPages: 0, 
              totalTrips: 0, 
              hasNext: false, 
              hasPrev: false 
            }
          });
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        console.error("Error fetching trips:", error);
        setError(error.response?.data?.message || "Failed to fetch trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [from, to, date, currentPage]);

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortTrips = (trips:ITrip[]) => {
    return [...trips].sort((a, b) => {
      switch (sortBy) {
        case 'time':
          const timeA = a.schedule?.startTime || '';
          const timeB = b.schedule?.startTime || '';
          return timeA.localeCompare(timeB);
        case 'price':
          return a.price - b.price; // Mock price comparison
         
        default:
          return 0;
      }
    });
  };

  const filterTrips = (trips:ITrip[]) => {
    if (filterBy === 'all') return trips;
    if (filterBy === 'ac') return trips.filter(trip => trip.bus?.amenities?.includes('AC'));
    if (filterBy === 'available') return trips.filter(trip => trip.availableSeats > 10);
    return trips;
  };

  const handleSelectSeats = (tripId:string) => {
    console.log('Selecting seats for trip:', tripId);
    router.push(`/trips/${tripId}`);
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <Bus className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-6">Finding the best buses for you...</p>
      <p className="text-gray-500 mt-2">This may take a few seconds</p>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>
  );

  const NoTripsFound = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
        <Bus className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No buses found</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn&apos;t find any buses for your selected route and date. 
        Try searching for a different date or route.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{from} → {to}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(date as string)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Pagination = () => {
    if (!tripsData?.pagination || tripsData.pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, hasNext, hasPrev } = tripsData.pagination;

    return (
      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-12 h-12 rounded-xl font-semibold transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <Button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={!hasNext}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (!from || !to || !date) {
    return (
      <div className="flex items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <SearchForm />
        </div>
      </div>
    );
  }

  const processedTrips = tripsData?.trips ? filterTrips(sortTrips(tripsData.trips)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Buses</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{from} → {to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(date)}</span>
                </div>
              </div>
            </div>
            
            {!loading && tripsData?.pagination && tripsData.pagination.totalTrips > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                  {tripsData.pagination.totalTrips} buses found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sort */}
        {!loading && processedTrips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as 'all' | 'ac' | 'available')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Buses</option>
                  <option value="ac">AC Buses</option>
                  <option value="available">High Availability</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'time' | 'price' | 'rating')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="time">Departure Time</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
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
        ) : processedTrips.length === 0 ? (
          <NoTripsFound />
        ) : (
          <>
            <div className="space-y-6">
              {processedTrips.map(trip => (
                <BusCard 
                  key={trip._id} 
                  trip={trip} 
                  
                  onSelectSeats={handleSelectSeats}
                />
              ))}
            </div>
            
            <Pagination />
            
            {/* Footer info */}
            <div className="text-center pt-8 mt-8 border-t border-gray-200">
              <p className="text-gray-600">
                Showing {processedTrips.length} of {tripsData?.pagination.totalTrips || 0} available buses
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripsPage;