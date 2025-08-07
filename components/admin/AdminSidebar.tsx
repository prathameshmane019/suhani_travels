'use client';

import { useState } from 'react';
import { Menu, Users, Route, Bus, BookOpen, BarChart3, RotateCcw, HeadphonesIcon, LogOut, X } from 'lucide-react';

const menuItems = [
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', href: '/admin' },
  { icon: <Route className="w-5 h-5" />, label: 'Routes', href: '/admin/routes' },
  { icon: <Bus className="w-5 h-5" />, label: 'Buses', href: '/admin/buses' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Bookings', href: '/admin/bookings' },
  { icon: <RotateCcw className="w-5 h-5" />, label: 'Refunds', href: '/admin/refunds' },
  { icon: <HeadphonesIcon className="w-5 h-5" />, label: 'Support', href: '/admin/support' },
  { icon: <Users className="w-5 h-5" />, label: 'Customers', href: '/admin/customers' },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold text-emerald-600">Bus Admin</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors"
                  onClick={() => onClose()}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const AdminNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Header for mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-emerald-600">Bus Admin</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-slate-600 hover:text-slate-900"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
