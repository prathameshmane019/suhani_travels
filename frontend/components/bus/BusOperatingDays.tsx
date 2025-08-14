import { ITrip } from "@/types/trip";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DayOfWeek } from "@/types";

export const BusOperatingDays = ({ trip }: { trip: ITrip }) => {
  if (!trip.schedule?.operatingDays?.length) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Operates: </span>
        <div className="flex gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const dayNames: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const isOperating = trip.schedule.operatingDays.includes(dayNames[index]);
            
            return (
              <Badge key={day} variant={isOperating ? 'default' : 'outline'} className="w-8 h-8 flex items-center justify-center">
                {day.charAt(0)}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};