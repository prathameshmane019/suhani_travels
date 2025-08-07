'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScheduleForm } from '@/components/admin/routes/ScheduleForm';
import { Schedule, ScheduleFormData } from '@/types/route';

export default function SchedulesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]); // TODO: Fetch from API
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  const handleCreateSchedule = async (data: ScheduleFormData) => {
    try {
      // TODO: API call to create schedule
      const newSchedule: Schedule = {
        ...data,
        id: Math.random().toString(), // Temporary ID generation - replace with API response
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });
      setSchedules([...schedules, newSchedule]);
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSchedule = async (data: ScheduleFormData) => {
    if (!selectedSchedule) return;
    
    try {
      // TODO: API call to update schedule
      const updatedSchedule: Schedule = {
        ...selectedSchedule,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === selectedSchedule.id ? updatedSchedule : schedule
      );
      setSchedules(updatedSchedules);
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    {
      accessorKey: 'routeName',
      header: 'Route',
    },
    {
      accessorKey: 'vehicleName',
      header: 'Vehicle',
    },
    {
      accessorKey: 'operatingDays',
      header: 'Operating Days',
      cell: ({ row }: { row: any }) => {
        const days = row.original.operatingDays;
        return days.map((day: string) => 
          day.charAt(0).toUpperCase() + day.slice(1)
        ).join(', ');
      },
    },
    {
      accessorKey: 'effectiveFrom',
      header: 'Effective From',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
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
      cell: ({ row }: { row: any }) => {
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
        routes={[]} // TODO: Fetch from API
        vehicles={[]} // TODO: Fetch from API
        mode={selectedSchedule ? 'edit' : 'create'}
        initialData={selectedSchedule || undefined}
      />
    </div>
  );
}
