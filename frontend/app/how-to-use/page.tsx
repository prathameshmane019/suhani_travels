"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function HowToUseStep({
  index,
  title,
  body,
  image,
  features,
}: {
  index: number;
  title: string;
  body: string;
  image: string;
  features: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16"
    >
      <div className={`relative w-full h-96 rounded-lg overflow-hidden ${index % 2 === 0 ? 'md:order-2' : ''}`}>
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent text-white text-lg font-bold">
            {index}
          </div>
          <h3 className="text-2xl font-semibold ml-4">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{body}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <motion.h1
          {...fadeUp}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          How to Book Your Bus Ticket
        </motion.h1>

        <HowToUseStep
          index={1}
          title="Search for Your Destination"
          body="Start by telling us where you want to go. Enter your departure and arrival cities, and the date you want to travel. Our smart search will find all available buses for your route."
          image="/images/s1.png"
          features={[
            "Real-time bus availability",
            "Search filters for bus types (AC, Non-AC, Sleeper)",
            "Sort by price, duration, or departure time",
          ]}
        />

        <HowToUseStep
          index={2}
          title="Select Your Bus and Seat"
          body="Browse the list of available buses. Compare prices, amenities, and ratings. Once you've found the perfect bus, use our interactive seat map to choose your preferred seats."
          image="/images/bus1.png"
          features={[
            "Detailed bus information with photos",
            "Interactive seat layout",
            "See available and booked seats in real-time",
          ]}
        />

        <HowToUseStep
          index={3}
          title="Fill in Passenger Details"
          body="Enter the required information for all passengers. Please double-check the details to ensure a smooth booking process. You will also need to provide contact information for the e-ticket."
          image="/images/bus2.png"
          features={[
            "Easy and secure form",
            "Option to save passenger details for future bookings",
            "Clear summary of your booking details",
          ]}
        />

        <HowToUseStep
          index={4}
          title="Pay and Get Your Ticket"
          body="Complete your booking by making a secure payment. We accept various payment methods, including credit/debit cards, UPI, and net banking. Your e-ticket will be sent to you instantly via email and SMS."
          image="/images/bus3.jpg"
          features={[
            "100% secure and encrypted payment gateway",
            "Multiple payment options",
            "Instant e-ticket generation",
          ]}
        />
        <div className="text-center">
            <Button asChild size="lg">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </div>
    </main>
  );
}