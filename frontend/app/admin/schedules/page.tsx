'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner'
import { ScheduleForm } from '@/components/admin/routes/ScheduleForm';
import type { BusSchedule, BusScheduleFormData } from '@/types/busSchedule';
import type {IRoute as RouteData } from '@/types/route';
import type { Bus } from '@/types';
import { api } from '@/lib/utils';

export default function SchedulesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  // Fetch schedules from backend
  useEffect(() => {
    api.get('/bus-schedules')
      .then(res => setSchedules(res.data))
      .catch(() => toast.error('Failed to fetch schedules'));
    api.get('/routes').then(res => setRoutes(res.data)).catch(() => { });
    api.get('/buses').then(res => setBuses(res.data)).catch(() => { });
  }, []);

  const handleCreateSchedule = async (data: BusScheduleFormData) => {
    try {
      await api.post('/bus-schedules', data);
      const res = await api.get('/bus-schedules');
      setSchedules(res.data);
      toast.success('Schedule created');
    } catch (error) {
      console.log(error);
      toast.error('Failed to create schedule');
    }
  };

  const handleUpdateSchedule = async (data: BusScheduleFormData) => {
    if (!selectedSchedule) return;
    try {
      await api.put(`/bus-schedules/${selectedSchedule._id}`, data);
      const res = await api.get('/bus-schedules');
      setSchedules(res.data);
      toast.success('Schedule updated');
    } catch (error) {
      console.log(error); 
      toast.error('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await api.delete(`/bus-schedules/${id}`);
      setSchedules(schedules => schedules.filter(s => s._id !== id));
      toast.success('Schedule deleted');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete schedule');
    }
  };

  const columns = [
    {
      accessorKey: 'routeId',
      header: 'Route',
      cell: ({ row }: { row: { original: BusSchedule } }) => {
        const route = row.original.routeId;
        return typeof route === 'object' && route !== null ? route.name || '-' : route;
      },
    },
    {
      accessorKey: 'busId',
      header: 'Bus',
      cell: ({ row }: { row: { original: BusSchedule } }) => {
        const bus = row.original.busId;
        return typeof bus === 'object' && bus !== null ? bus.model || '-' : bus;
      },
    },
    {
      accessorKey: 'operatingDays',
      header: 'Operating Days',
      cell: ({ row }: { row: { original: BusSchedule } }) => {
        const days = row.original.operatingDays;
        return days.map((day: string) =>
          day.charAt(0).toUpperCase() + day.slice(1)
        ).join(', ');
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: BusSchedule } }) => {
        const status = row.original.status;
        return (
          <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: BusSchedule } }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedSchedule(row.original);
              setIsFormOpen(true);
            }}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
        <Button onClick={() => {
          setSelectedSchedule(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      <DataTable columns={columns} data={schedules} />

      <ScheduleForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSchedule(null);
        }}
        onSubmit={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
        routes={routes}
        vehicles={buses}
        mode={selectedSchedule ? 'edit' : 'create'}
        initialData={selectedSchedule ? {
          ...selectedSchedule,
          routeId: typeof selectedSchedule.routeId === 'object' && selectedSchedule.routeId !== null ? selectedSchedule.routeId._id : selectedSchedule.routeId,
          busId: typeof selectedSchedule.busId === 'object' && selectedSchedule.busId !== null ? selectedSchedule.busId._id : selectedSchedule.busId,
        } : undefined}
      />
    </div>
  );
}
