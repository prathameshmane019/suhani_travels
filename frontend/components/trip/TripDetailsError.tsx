import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export const TripDetailsError = ({ error }: { error: string }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Trip Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};