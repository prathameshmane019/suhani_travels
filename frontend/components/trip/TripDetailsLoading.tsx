import { Skeleton } from "@/components/ui/skeleton";

export const TripDetailsLoading = () => {
  return (
    <div className="min-h-screen  ">
      <header className="bg-card shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48" />
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
};