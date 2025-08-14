'use client';

import { useState, useEffect, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { IRefundRequest } from '@/types/refund';
import { RefundRequestTable } from '@/components/admin/refunds/RefundRequestTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RefundsPage = () => {
  const [refunds, setRefunds] = useState<IRefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await api.get('/refunds');
        setRefunds(res.data);
      } catch (error) {
        toast.error('Failed to fetch refund requests');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  const filteredRefunds = useMemo(() => {
    return refunds.filter(refund => {
      return filterStatus === 'all' || refund.status === filterStatus;
    });
  }, [refunds, filterStatus]);

  const handleProcessRefund = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/refunds/${id}`, { status });
      setRefunds(refunds.map(refund =>
        refund._id === id ? { ...refund, status } : refund
      ));
      toast.success(`Refund request ${status}`);
    } catch (error) {
        console.log(error);

      toast.error('Failed to process refund');
    }
  };

  const handleDeleteRefund = async (id: string) => {
    try {
      await api.delete(`/refunds/${id}`);
      setRefunds(refunds.filter(refund => refund._id !== id));
      toast.success('Refund request deleted');
    } catch (error) {
        console.log(error);

      toast.error('Failed to delete refund request');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading refund requests...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Refunds</h1>
          <p className="text-muted-foreground mt-2">Handle cancellations and process refunds</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-5 h-5 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Refund Requests</h2>
        </div>
        <RefundRequestTable
          refunds={filteredRefunds}
          onProcess={handleProcessRefund}
          onDelete={handleDeleteRefund}
        />
      </div>

      {/* Refund Policies */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Refund Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-muted rounded-xl">
            <h3 className="font-semibold text-foreground mb-2">24+ Hours Before Departure</h3>
            <p className="text-muted-foreground text-sm">Full refund minus processing fee</p>
          </div>
          <div className="p-4 bg-muted rounded-xl">
            <h3 className="font-semibold text-foreground mb-2">12-24 Hours Before Departure</h3>
            <p className="text-muted-foreground text-sm">50% refund minus processing fee</p>
          </div>
          <div className="p-4 bg-muted rounded-xl">
            <h3 className="font-semibold text-foreground mb-2">&lt;12 Hours Before Departure</h3>
            <p className="text-muted-foreground text-sm">No refund available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundsPage;