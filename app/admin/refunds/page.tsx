import { Filter, RotateCcw } from 'lucide-react';

const RefundsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Refunds</h1>
          <p className="text-slate-500 mt-2">Handle cancellations and process refunds</p>
        </div>
        <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filter Requests
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Refund Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Request Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">RF{String(index + 1).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">BK{String(index + 1).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">John Doe</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">₹2,500</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Change of plans</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Aug 7, 2025</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      <RotateCcw className="w-4 h-4" />
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Policies */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Refund Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-2">24+ Hours Before Departure</h3>
            <p className="text-slate-600 text-sm">Full refund minus processing fee</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-2">12-24 Hours Before Departure</h3>
            <p className="text-slate-600 text-sm">50% refund minus processing fee</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-2">&lt;12 Hours Before Departure</h3>
            <p className="text-slate-600 text-sm">No refund available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundsPage;
