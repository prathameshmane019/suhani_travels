import { BarChart3, Download, Calendar, Filter } from 'lucide-react';

const BookingsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bookings & Revenue</h1>
          <p className="text-slate-500 mt-2">View and manage bookings and revenue reports</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Calendar className="w-5 h-5" />
            Select Date Range
          </button>
          <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Total Revenue</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">₹12,45,650</p>
          <p className="text-sm text-emerald-600 mt-2">+12.5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Total Bookings</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">1,234</p>
          <p className="text-sm text-emerald-600 mt-2">+8.2% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Average Booking Value</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">₹1,850</p>
          <p className="text-sm text-emerald-600 mt-2">+5.1% from last month</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Route</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Bus</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Travel Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">BK{String(index + 1).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">John Doe</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Mumbai - Delhi</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Volvo 9400</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Aug 7, 2025</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">₹2,500</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
