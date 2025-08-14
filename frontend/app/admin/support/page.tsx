'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Phone, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { ISupportTicket } from '@/types/support';
import { SupportTicketTable } from '@/components/admin/support/SupportTicketTable';

const SupportPage = () => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/support');
        setTickets(res.data);
      } catch (error) {
        toast.error('Failed to fetch support tickets');
        console.log(error);

      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  const openTickets = useMemo(() => filteredTickets.filter(ticket => ticket.status === 'open').length, [filteredTickets]);
  // Placeholder for Avg. Response Time and Resolution Rate - requires more complex logic
  const avgResponseTime = "N/A";
  const resolutionRate = "N/A";

  const handleDeleteTicket = async (id: string) => {
    try {
      await api.delete(`/support/${id}`);
      setTickets(tickets.filter(ticket => ticket._id !== id));
      toast.success('Ticket deleted successfully');
    } catch (error) {
      console.log(error); 
      toast.error('Failed to delete ticket');
    }
  };

  const handleQuickAction = (action: string) => {
    toast.info(`Action: ${action}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading support tickets...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
        <p className="text-muted-foreground mt-2">Manage customer inquiries and support tickets</p>
      </div>

      <div className="flex gap-6">
        {/* Support Tickets */}
        <div className="flex-1">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Support Tickets</h2>
                <div className="relative">
                  <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <SupportTicketTable tickets={filteredTickets} onDelete={handleDeleteTicket} />
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="w-80 space-y-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-foreground">{openTickets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold text-foreground">{avgResponseTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold text-foreground">{resolutionRate}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => handleQuickAction('New Message')} className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-muted transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-foreground">New Message</span>
              </button>
              <button onClick={() => handleQuickAction('Call Customer')} className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-muted transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-foreground">Call Customer</span>
              </button>
              <button onClick={() => handleQuickAction('Send Email')} className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-muted transition-colors">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-foreground">Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;