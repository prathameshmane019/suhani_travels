import { ITrip } from "@/types/trip";
import { AirVent, Wifi, Zap, Coffee } from "lucide-react";

export const BusAmenities = ({ trip }: { trip: ITrip }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'ac': return <AirVent className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'charging point': return <Zap className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  if (!trip.bus?.amenities?.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Amenities</h4>
      <div className="flex flex-wrap gap-3">
        {trip.bus.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground border hover:shadow-md transition-shadow">
            {getAmenityIcon(amenity)}
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};