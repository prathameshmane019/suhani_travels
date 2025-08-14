'use client'; // Mark as client component if useSearchParams is used in children

import { Suspense } from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}