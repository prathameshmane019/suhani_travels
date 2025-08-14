import { ITrip } from "@/types/trip";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const BusAvailability = ({ trip, onSelectSeats }: { trip: ITrip, onSelectSeats: (tripId: string) => void }) => {
  const availabilityPercentage = trip.bus?.seats ? (trip.availableSeats / trip.bus.seats) * 100 : 0;

  const getProgressColor = () => {
    if (availabilityPercentage < 25) return "bg-destructive";
    if (availabilityPercentage < 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex flex-col my-3 md:flex-row md:items-end justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            <span className={`font-bold text-lg ${trip.availableSeats < 10 ? 'text-destructive' : 'text-green-600'}`}>
              {trip.availableSeats}
            </span>
            <span className="text-muted-foreground"> seats available</span>
            {trip.bus?.seats && (
              <span className="text-muted-foreground/80"> out of {trip.bus.seats}</span>
            )}
          </span>
        </div>
        
        {trip.bus?.seats && (
          <div className="relative">
            <Progress value={availabilityPercentage} className="h-3" indicatorClassName={getProgressColor()} />
            <span className="absolute right-0 top-4 text-xs text-muted-foreground font-medium">
              {Math.round(availabilityPercentage)}% available
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-4xl font-bold text-foreground mb-1">{trip?.price || 0}</div>
          <div className="text-sm font-medium text-muted-foreground">per person</div>
        </div>
        
        <Button 
          onClick={() => onSelectSeats(trip._id)}
          size="lg"
          className="group/btn"
        >
          Select Seats
          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};