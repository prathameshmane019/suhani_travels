'use client';

import { cn } from "@/lib/utils";
import { Bus, Calendar,Navigation, Home, Map, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Rides",
    icon: Map,
    href: "/admin/rides",
  },
  {
    title: "Routes",
    icon: Navigation,
    href: "/admin/routes",
  },
  {
    title: "Schedules",
    icon: Calendar,
    href: "/admin/schedules",
  },
  {
    title: "Vehicles",
    icon: Bus,
    href: "/admin/vehicles",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Suhani Travels</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-full bg-slate-800" />
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-slate-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
