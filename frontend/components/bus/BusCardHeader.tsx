import { ITrip } from "@/types/trip";
import { Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const BusCardHeader = ({ trip }: { trip: ITrip }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Bus className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">
          {trip.bus?.registrationNumber || 'N/A'}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {trip.bus?.type?.replace('-', ' ').toUpperCase() || 'Standard'}
          </Badge>
          {trip.bus?.busModel && (
            <Badge variant="outline">{trip.bus.busModel}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};