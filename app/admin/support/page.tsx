import { MessageSquare, Phone, Mail, Search } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Customer Support</h1>
        <p className="text-slate-500 mt-2">Manage customer inquiries and support tickets</p>
      </div>

      <div className="flex gap-6">
        {/* Support Tickets */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Ticket ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 text-sm text-slate-600">TK{String(index + 1).padStart(4, '0')}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">John Doe</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Booking Cancellation Issue</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          High
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Open
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">2 hours ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="w-80 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-800">24</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Avg. Response Time</p>
                <p className="text-2xl font-bold text-slate-800">2.5h</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Resolution Rate</p>
                <p className="text-2xl font-bold text-slate-800">95%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-50 transition-colors">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-600">New Message</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-50 transition-colors">
                <Phone className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-600">Call Customer</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-50 transition-colors">
                <Mail className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-600">Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
