
import { ITrip } from "@/types/trip";
import { Card, CardContent } from "@/components/ui/card";
import { BusCardHeader } from "./bus/BusCardHeader";
import { BusRouteInfo } from "./bus/BusRouteInfo";
import { BusAvailability } from "./bus/BusAvailability";

const BusCard = ({ trip, onSelectSeats }: { trip: ITrip, onSelectSeats: (tripId: string) => void }) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200">
      <CardContent className="p-3">
        <BusCardHeader trip={trip} />
        <div className="my-2 p-2 border-t border-gray-200" />
        <BusRouteInfo trip={trip} />
        <BusAvailability trip={trip} onSelectSeats={onSelectSeats} />
      </CardContent>
    </Card>
  );
};

export default BusCard;