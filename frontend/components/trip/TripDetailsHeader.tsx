import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const TripDetailsHeader = ({ from, to }: { from: string, to: string }) => {
  const router = useRouter();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline ml-2">Back</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground text-center">
            {from} to {to}
          </h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </div>
    </header>
  );
};