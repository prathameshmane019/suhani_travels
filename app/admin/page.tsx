import { BarChart3, Users, Bus, IndianRupee, TrendingUp } from 'lucide-react';

const StatCard = ({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-emerald-50 rounded-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-500 font-medium">{label}</h3>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<IndianRupee className="w-6 h-6 text-emerald-600" />}
          label="Total Revenue"
          value="₹2,45,650"
          change="+12.5%"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          label="Total Bookings"
          value="1,234"
          change="+8.2%"
        />
        <StatCard
          icon={<Bus className="w-6 h-6 text-emerald-600" />}
          label="Active Routes"
          value="48"
          change="+5.1%"
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
          label="Occupancy Rate"
          value="85%"
          change="+3.7%"
        />
      </div>

      {/* Recent Bookings Table */}
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
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Date</th>
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
                  <td className="px-6 py-4 text-sm text-slate-600">Aug 7, 2025</td>
                  <td className="px-6 py-4 text-sm text-slate-600">₹2,500</td>
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

export default DashboardPage;
