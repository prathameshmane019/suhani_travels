
import { Suspense } from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="  mt-10 bg-background"> 
      <main className="lg:mx-10 p-4 lg:p-8 pt-4">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminLayout;
