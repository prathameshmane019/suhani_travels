'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus } from "@/types";
import { ImageIcon, Pencil, Trash2 } from "lucide-react"; 
import Image from "next/image";

interface BusCardProps {
  bus: Bus;
  onEdit: (bus: Bus) => void;
  onDelete: (busId: string) => void;
}

export function BusCard({ bus, onEdit, onDelete }: BusCardProps) {
  const statusColorMap: Record<"active" | "maintenance" | "inactive", "success" | "warning" | "destructive"> = {
    active: "success",
    maintenance: "warning",
    inactive: "destructive",
  };
  const statusColor: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | null | undefined = statusColorMap[bus.status as "active" | "maintenance" | "inactive"];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-muted">
        {bus.image ? (
          <Image
            src={bus.image}
            alt={bus.busModel}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{bus.busModel}</h3>
          <Badge variant={statusColor}>{bus.status}</Badge>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{bus.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Seats</span>
              <span className="font-medium">{bus.seats}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="mt-4 flex flex-wrap gap-2">
          {bus.amenities.map((amenity) => (
            <Badge key={amenity} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(bus)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
              onClick={() => onDelete(bus._id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
