import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";

interface BusCardProps {
  _id: string;
  busModel: string;
  type: string;
  amenities: string[];
  image?: string;
  rating: number;
}

interface FeaturedBusesProps {
  buses: BusCardProps[];
}

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

const FeaturedBuses: React.FC<FeaturedBusesProps> = ({ buses }) => {
  return (
    <section id="fleet" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
      <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
        Our Premium Fleet
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {buses.map((bus) => (
          <motion.div
            key={bus._id}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{bus.busModel} ({bus.type})</CardTitle>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span>{bus.rating.toFixed(1)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-4">
                  <Image
                    src={bus.image || "/images/bus-placeholder.png"} // Use a placeholder if no image
                    alt={`${bus.busModel} bus`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Amenities: {bus.amenities.join(", ") || "No amenities listed"}
                </p>
                <div className="flex gap-3">
                  <Button size="sm" className="flex-1">View Details</Button>
                  <Button size="sm" variant="outline" className="flex-1">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBuses;
