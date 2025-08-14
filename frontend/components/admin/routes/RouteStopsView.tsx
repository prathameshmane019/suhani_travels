'use client';

import { RouteStop } from "@/types/route";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RouteStopsViewProps {
  open: boolean;
  onClose: () => void;
  routeName: string;
  stops: RouteStop[];
}

export function RouteStopsView({ open, onClose, routeName, stops }: RouteStopsViewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{routeName}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Route schedule and stops information
          </p>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="relative">
            {stops.map((stop, index) => (
              <div key={`${stop.name}-${index}`} className="flex gap-4 items-start relative">
                {/* Timeline connector */}
                {index < stops.length - 1 && (
                  <div className="absolute top-6 left-[15px] bottom-0 w-0.5 bg-slate-200" />
                )}
                
                {/* Stop marker and details */}
                <div className="flex flex-col items-center pt-2">
                  <div 
                    className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center
                      ${index === 0 ? 'border-emerald-500 bg-emerald-50' : 
                        index === stops.length - 1 ? 'border-rose-500 bg-rose-50' : 
                        'border-blue-500 bg-blue-50'}`}
                  >
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="text-base font-medium text-slate-900">{stop.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
