import { ITrip } from "@/types/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusIcon, MapPin, Clock, CreditCard } from "lucide-react";

export const TripSummaryCard = ({ trip, from, to }: { trip: ITrip, from: string, to: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BusIcon className="inline-block mr-3 h-7 w-7 text-primary" />
          {trip.bus.model} - {trip.bus.registrationNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-muted-foreground">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 mt-1 text-primary/80 flex-shrink-0" />
            <div>
              <strong className="block text-foreground">From:</strong>
              <span>{from}</span>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 mt-1 text-primary/80 flex-shrink-0" />
            <div>
              <strong className="block text-foreground">To:</strong>
              <span>{to}</span>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 mt-1 text-primary/80 flex-shrink-0" />
            <div>
              <strong className="block text-foreground">Departure:</strong>
              <span>
                {new Date(trip.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' at '}
                {trip.schedule.departureTime}
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 mt-1 text-primary/80 flex-shrink-0" />
            <div>
              <strong className="block text-foreground">Arrival:</strong>
              <span>
                {new Date(trip.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' at '}
                {trip.schedule.arrivalTime}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-primary/80" />
            <strong className="text-foreground">Price per seat:</strong>
          </div>
          <span className="text-2xl font-bold text-green-600">${(trip.price)?.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};