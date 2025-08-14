import { ITrip } from "@/types/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AirVent, Wifi } from "lucide-react";

export const TripAmenitiesCard = ({ trip }: { trip: ITrip }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {trip.bus.amenities.map(amenity => (
            <Badge key={amenity} variant="outline" className="text-sm">
              {amenity === "WiFi" && <Wifi className="h-5 w-5 mr-2 text-primary" />}
              {amenity === "Air Conditioning" && <AirVent className="h-5 w-5 mr-2 text-primary" />}
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};