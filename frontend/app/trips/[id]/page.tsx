"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ITrip } from '@/types/trip';
import { api } from '@/lib/utils';
// import SeatSelection from '@/components/SeatSelection';

import { TripDetailsLoading } from '@/components/trip/TripDetailsLoading';
import { TripDetailsError } from '@/components/trip/TripDetailsError';
import { TripDetailsHeader } from '@/components/trip/TripDetailsHeader';
import { TripSummaryCard } from '@/components/trip/TripSummaryCard';
import { TripAmenitiesCard } from '@/components/trip/TripAmenitiesCard';
import { BookingSummaryCard } from '@/components/trip/BookingSummaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 
import { SeatSelection } from '@/components/admin/buses/SeatSelection';

const TripDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const tripId = params?.id;


  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${tripId}`);
      setTrip(response.data);
      console.log(response.data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  
  useEffect(() => {
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId, fetchTripDetails]);
  
  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      // Maybe use a toast here instead of alert
      alert('Please select at least one seat');
      return;
    }

    
    setBookingInProgress(true);
    router.push(`/trips/${tripId}/checkout?tripId=${tripId}&seats=${selectedSeats.join(',')}`);
  };

  const getRouteInfo = () => {
    if (!trip) return { from: '', to: '' };
    const stops = trip.route.stops.sort((a, b) => a.sequence - b.sequence);
    const fromStop = stops[0]?.name || 'Unknown';
    const toStop = stops[stops.length - 1]?.name || 'Unknown';
    return { from: fromStop, to: toStop };
  };

  if (loading) {
    return <TripDetailsLoading />;
  }

  if (error || !trip) {
    return <TripDetailsError error={error || "Trip not found"} />;
  }

  const { from, to } = getRouteInfo();

  return (
    <div className="min-h-screen bg-background">
      <TripDetailsHeader from={from} to={to} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TripSummaryCard trip={trip} from={from} to={to} />
            <TripAmenitiesCard trip={trip} />
            <Card>
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Choose your seats to proceed with the booking.</p>
                {/* <SeatSelection
                  totalSeats={trip.bus.seats}
                  price={trip.price}
                  bookedSeats={trip.bookedSeats}
                  onSeatSelect={handleSeatSelection}
                  selectedSeats={selectedSeats}
                /> */}
                 <SeatSelection
                        seatLayout={trip.bus.seatLayout}
                        bookedSeats={trip.bookedSeats}
                        onSeatSelect={handleSeatSelection}
                        selectedSeats={selectedSeats}
                         
                      />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <BookingSummaryCard
              trip={trip}
              selectedSeats={selectedSeats}
              bookingInProgress={bookingInProgress}
              onBooking={handleBooking}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetailsPage;