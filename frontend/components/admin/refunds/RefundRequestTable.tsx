'use client';

import { IRefundRequest } from '@/types/refund';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RotateCcw } from 'lucide-react';

interface RefundRequestTableProps {
  refunds: IRefundRequest[];
  onProcess: (id: string, status: 'approved' | 'rejected') => void;
  onDelete: (id: string) => void;
}

export const RefundRequestTable = ({ refunds, onProcess, onDelete }: RefundRequestTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Request ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Booking ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Reason</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Request Date</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {refunds.map((refund) => (
            <tr key={refund._id} className="hover:bg-muted/50">
              <td className="px-6 py-4 text-sm text-foreground">{refund._id.slice(-6).toUpperCase()}</td>
              <td className="px-6 py-4 text-sm text-foreground">{refund.bookingId.slice(-6).toUpperCase()}</td>
              <td className="px-6 py-4 text-sm text-foreground">{refund.customerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-foreground">₹{refund.amount.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-foreground">{refund.reason}</td>
              <td className="px-6 py-4 text-sm text-foreground">{new Date(refund.requestDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <Badge variant={refund.status === 'pending' ? 'secondary' : refund.status === 'approved' ? 'default' : 'destructive'}>
                  {refund.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {refund.status === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => onProcess(refund._id, 'approved')}>
                          <RotateCcw className="w-4 h-4 mr-2" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onProcess(refund._id, 'rejected')}>
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(refund._id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
