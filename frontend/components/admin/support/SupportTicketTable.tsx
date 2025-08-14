'use client';

import { ISupportTicket } from '@/types/support';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface SupportTicketTableProps {
  tickets: ISupportTicket[];
  onDelete: (id: string) => void;
}

export const SupportTicketTable = ({ tickets, onDelete }: SupportTicketTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Ticket ID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Priority</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Created</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-muted/50 cursor-pointer">
              <td className="px-6 py-4 text-sm text-foreground">{ticket._id.slice(-6).toUpperCase()}</td>
              <td className="px-6 py-4 text-sm text-foreground">{ticket.customerName}</td>
              <td className="px-6 py-4 text-sm text-foreground">{ticket.subject}</td>
              <td className="px-6 py-4">
                <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'secondary' : 'outline'}>
                  {ticket.priority}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'resolved' ? 'success' : 'secondary'}>
                  {ticket.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(ticket._id)}>Delete</DropdownMenuItem>
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
