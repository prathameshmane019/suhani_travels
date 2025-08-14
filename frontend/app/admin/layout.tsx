import { ReactNode } from 'react';
import { AdminNavigation } from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="  mt-15 bg-background">
      <AdminNavigation />
      <main className="lg:ml-64 p-4 lg:p-8 pt-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
