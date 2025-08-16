'use client';
import { useState } from 'react';
import { Menu, Users, Navigation, Route, Bus, BookOpen, BarChart3, RotateCcw, HeadphonesIcon, LogOut, X, Megaphone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin' },
    { icon: Navigation, label: 'Schedules', href: '/admin/schedules' },
    { icon: Route, label: 'Routes', href: '/admin/routes' },
    { icon: Bus, label: 'Buses', href: '/admin/buses' },
    { icon: BookOpen, label: 'Bookings', href: '/admin/bookings' },
    { icon: RotateCcw, label: 'Refunds', href: '/admin/refunds' },
    { icon: HeadphonesIcon, label: 'Support', href: '/admin/support' },
    { icon: Users, label: 'Customers', href: '/admin/users' },
    { icon: Megaphone, label: 'Banner', href: '/admin/banners' },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const pathname = usePathname();
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/20 lg:hidden z-20"
                    onClick={onClose}
                />
            )}
            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 bottom-0 left-0 w-64 bg-sidebar shadow-lg z-30",
                "transform transition-transform duration-300 ease-in-out",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
                    <h1 className="text-2xl font-bold text-primary">Bus Admin</h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-foreground hover:text-primary"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        )}
                                        onClick={() => onClose()}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="absolute bottom-0 w-full p-6 border-t border-sidebar-border">
                    <button className="flex items-center gap-3 p-3 w-full rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
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
            <div className="lg:hidden flex items-center justify-between p-4 bg-card shadow-sm">
                <h1 className="text-xl font-bold text-primary">Bus Admin</h1>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-foreground hover:text-primary"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};
