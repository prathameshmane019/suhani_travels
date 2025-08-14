import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; 
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface RouteCardProps {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  rating?: number;
  amenities?: string[];
}

interface FeaturedRoutesProps {
  routes: RouteCardProps[];
}

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

const FeaturedRoutes: React.FC<FeaturedRoutesProps> = ({ routes }) => {
  const handleQuickBook = (r: RouteCardProps) => {
    // Implement quick book logic or navigate to booking page
    console.log(`Quick booked 1 seat: ${r.from} → ${r.to}`);
  };

  return (
    <section id="popular-routes" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
      <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-6">
        Popular Routes
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-card border border-border shadow-sm p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">{r.from} → {r.to}</div>
                  <h4 className="text-lg font-semibold">{r.from} — {r.to}</h4>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">{formatPrice(r.price)}</div>
                  <div className="text-xs text-muted-foreground">{r.duration}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">
                {r.amenities?.slice(0, 3).join(" • ")}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button size="sm" onClick={() => handleQuickBook(r)} className="flex-1">
                Quick Book
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/trips?from=${r.from}&to=${r.to}`}>View</Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* more routes CTA */}
      <div className="mt-8 flex items-center justify-center">
        <Button variant="outline" className="rounded-full border-muted px-6 py-2" asChild>
          <Link href="/routes">View All Routes</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedRoutes;
