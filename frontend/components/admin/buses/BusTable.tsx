'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus } from "@/types";
import { Pencil, Trash2 } from "lucide-react"; 

interface BusTableProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onDelete: (busId: string) => void;
}

export function BusTable({ buses, onEdit, onDelete }: BusTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bus ID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total Seats</TableHead> 
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.map((bus) => (
                        <TableRow key={bus._id}>
              <TableCell className="font-medium">{bus._id}</TableCell>
              <TableCell>{bus.busModel}</TableCell>
              <TableCell>{bus.type}</TableCell>
              <TableCell>{bus.seats}</TableCell> 
              <TableCell>
                <Badge
                  variant={
                    bus.status === 'active'
                      ? 'success'
                      : bus.status === 'maintenance'
                      ? 'warning'
                      : 'destructive'
                  }
                >
                  {bus.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(bus)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(bus._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
