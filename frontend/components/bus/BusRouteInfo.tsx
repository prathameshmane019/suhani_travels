import { ITrip } from "@/types/trip";
import { Clock, MapPin } from "lucide-react";

export const BusRouteInfo = ({ trip }: { trip: ITrip }) => {
    const getRouteStops = () => {
        if (!trip.route?.stops) return { from: 'N/A', to: 'N/A' };
        const stops = trip.route.stops.sort((a, b) => a.sequence - b.sequence);
        return {
          from: stops[0]?.name || 'N/A',
          to: stops[stops.length - 1]?.name || 'N/A'
        };
      };
    
      const { from, to } = getRouteStops();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-foreground mb-2">{trip.schedule?.startTime || 'N/A'}</div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{from}</span>
          </div>
        </div>
        
        <div className="flex-1 px-4">
          <div className="relative">
            <div className="h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background px-3 py-1 rounded-full border-2 border-primary/50 text-sm font-medium text-primary">
                <Clock className="w-4 h-4 inline mr-1" />
                Direct
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-foreground mb-2">{trip.schedule?.endTime || 'N/A'}</div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{to}</span>
          </div>
        </div>
      </div>
    </div>
  );
};