"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Bus, 
  MapPin,
  Phone,
  Star, 
  Users,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchForm from "@/components/SearchForm";
import { toast } from "sonner"; 
import BusShowcase from "@/components/home/ImageGallery";

 

type RouteCard = {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  rating?: number;
  amenities?: string[];
};

type Testimonial = {
  id: string;
  name: string;
  text: string;
  avatar: string;
  role: string;
  rating?: number;
};

const popularRoutesSeed: RouteCard[] = [
  { id: "r1", from: "Mumbai", to: "Pune", price: 399, duration: "4h 15m", rating: 4.6, amenities: ["AC", "WiFi", "Charging"] },
  { id: "r2", from: "Mumbai", to: "Goa", price: 799, duration: "10h", rating: 4.7, amenities: ["Sleeper", "Blanket"] },
  { id: "r3", from: "Pune", to: "Goa", price: 699, duration: "9h 30m", rating: 4.5, amenities: ["AC", "Recliner"] },
  { id: "r4", from: "Mumbai", to: "Bangalore", price: 1299, duration: "16h", rating: 4.4, amenities: ["AC", "Onboard Dining"] }, 
];

const testimonialsSeed: Testimonial[] = [
  { id: "t1", name: "Anjali K.", text: "Smooth booking, comfy seats and punctual service. Highly recommend Suhani Travels!", avatar: "/images/user1.jpg", role: "Verified Passenger", rating: 5 },
  { id: "t2", name: "Rohit S.", text: "Premium buses and friendly staff. Booking UI is clean and fast.", avatar: "/images/user2.jpg", role: "Frequent Traveler", rating: 4 },
  { id: "t3", name: "Meera P.", text: "Loved the legroom and recliner seats — best overnight journey I've had.", avatar: "/images/user3.jpg", role: "Tourist", rating: 5 },
  { id: "t4", name: "Suresh P.", text: "Excellent customer support when I needed a change in schedule.", avatar: "/images/user2.jpg", role: "Business Traveler", rating: 4 },
];

const faqItemsSeed = [
  {
    question: "What payment options do you accept?",
    answer: "We accept UPI, major debit & credit cards, and net banking. Payment gateway is encrypted and PCI-compliant.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes — cancellations are allowed per fare rules. Rescheduling fees may apply. Please check your ticket details.",
  },
  {
    question: "Is seat selection guaranteed?",
    answer: "Seat selection is subject to availability at booking time. Selected seat is reserved immediately upon confirmation.",
  },
  {
    question: "Do you provide travel insurance?",
    answer: "We provide optional travel insurance at checkout — you can enable or disable it before payment.",
  },
];
 
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

/**
 * get a short excerpt for long text
 */
 
/* ---------------------------
   Animated counters (hook)
   --------------------------- */

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return () => { };
  }, [target, duration]);
  return value;
}

/* ---------------------------
   Visual / Motion helpers
   --------------------------- */

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

/* ---------------------------
   Main Page Component
   --------------------------- */

export default function HomePage() {
  // states
  const [routes] = useState<RouteCard[]>(popularRoutesSeed);
  const [testimonials] = useState<Testimonial[]>(testimonialsSeed);
  const [faqItems] = useState(faqItemsSeed);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimerRef = useRef<number | null>(null);

  // statistics (animated)
  const passengersServed = useAnimatedNumber(128_450);
  const citiesCovered = useAnimatedNumber(142);
  const busesInFleet = useAnimatedNumber(348);

  useEffect(() => {
    testimonialTimerRef.current = window.setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => {
      if (testimonialTimerRef.current) window.clearInterval(testimonialTimerRef.current);
    };
  }, [testimonials.length]);

  // helpful memoized values
  const topRoutes = useMemo(() => routes.slice(0, 6), [routes]);

  // fake action for booking to show toast (replace with real flow)
  const handleQuickBook = (r: RouteCard) => {
    toast.success(`Quick booked 1 seat: ${r.from} → ${r.to} — ${formatCurrency(r.price)}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      {/* ---------- HERO (large gradient + search) ---------- */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden pt-24 sm:pt-20 lg:pt-24"
      >
        {/* large decorative gradient shapes */}
        <div className="pointer-events-none absolute -left-40 -top-40 w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-primary/30 to-accent/20 blur-3xl opacity-70 transform rotate-[30deg]"></div>
        <div className="pointer-events-none absolute -right-56 -bottom-40 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-accent/30 to-primary/10 blur-3xl opacity-60 transform rotate-[10deg]"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
              >
                Experience the Joy of Travel with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Suhani Travels
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="max-w-2xl text-lg text-muted-foreground"
              >
                Seamless bookings, premium coaches, live bus tracking, and secure payments —
                everything you need for stress-free journeys across India.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Button size="lg" className="rounded-full bg-primary hover:brightness-90">
                  Book your tickets
                  <ArrowRight className="ml-2" />
                </Button>

                <Button variant="ghost" className="rounded-full border border-muted">
                  Explore routes
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Secure payments • 24/7 support
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <StatCard label="Passengers" value={passengersServed} icon={<Users className="h-5 w-5" />} />
                <StatCard label="Cities" value={citiesCovered} icon={<MapPin className="h-5 w-5" />} />
                <StatCard label="Buses" value={busesInFleet} icon={<Bus className="h-5 w-5" />} />
                <StatCard label="Years" value={15} icon={<Star className="h-5 w-5" />} />
              </motion.div>
            </div>

            {/* right column: phone mockup + mini features */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full   ">
                {/* phone mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className=""
                >
                  <Image
                    src="/images/bus1.png"
                    alt="App preview — Suhani Travels"
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </motion.div>

                {/* floating mini cards */}

              </div>
            </div>
          </div>

          {/* search form anchored under hero */}
          <div className="mt-8 mb-12 relative z-10 ">
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className=" "
                role="region"
                aria-label="Search form"
              >
                {/* Your existing SearchForm component — crisp & functional */}
                <SearchForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ HOW IT WORKS (link to dedicated page) ------------------ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-8 mt-16 text-center">
        <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold mb-4">
          How It Works
        </motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Booking your bus ticket with Suhani Travels is simple and fast. We&apos;ve designed a straightforward process so you can book your journey in just a few clicks.
        </motion.p>
        <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
          <Button asChild size="lg">
            <Link href="/how-to-use">View Step-by-Step Guide</Link>
          </Button>
        </motion.div>
      </section>

      {/* ------------------ POPULAR ROUTES (grid of cards) ------------------ */}
      <section id="popular-routes" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
        <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-6">
          Popular Routes
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topRoutes.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.03 }}
              className="rounded-xl bg-card border border-border shadow-sm p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">{r.from} → {r.to}</div>
                    <h4 className="text-base font-semibold">{r.from} — {r.to}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-primary font-bold text-sm">{formatCurrency(r.price)}</div>
                    <div className="text-xs text-muted-foreground">{r.duration}</div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  {r.amenities?.slice(0, 3).join(" • ")}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button size="xs" onClick={() => handleQuickBook(r)} className="flex-1 h-8">
                  Quick Book
                </Button>
                <Button size="xs" variant="ghost" asChild className="h-8">
                  <a href="#fleet">View</a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* more routes CTA */}
        <div className="mt-8 flex items-center justify-center">
          <Button variant="outline" className="rounded-full border-muted px-6 py-2">
            View All Routes
          </Button>
        </div>
      </section>

      {/* ------------------ FLEET SHOWCASE ------------------ */}
      <section id="fleet" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
        <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
          Our Fleet
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Luxury Sleeper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <Image src="/images/bus1.png" alt="Luxury Sleeper" fill className="object-cover" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Wide beds, privacy curtains, personal lights and power points for a relaxed overnight journey.
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm">Check Routes</Button>
                <Button size="sm" variant="ghost">Seat Map</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Executive Seater</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <Image src="/images/bus2.png" alt="Executive Seater" fill className="object-cover" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Recliner seats, generous legroom, and premium onboard service for comfortable daytime trips.
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm">Check Routes</Button>
                <Button size="sm" variant="ghost">Seat Map</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>AC Seater</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <Image src="/images/bus3.jpg" alt="AC Seater" fill className="object-cover" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Short-distance AC seater coaches ideal for day trips and comfortable commutes.
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm">Check Routes</Button>
                <Button size="sm" variant="ghost">Seat Map</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------ TESTIMONIALS (carousel) ------------------ */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
        <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-6">
          What our customers say
        </motion.h3>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={testimonials[testimonialIndex].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45 }}
                className="bg-card rounded-2xl p-6 shadow-lg flex gap-4 items-center border"
              >
                <Image
                  src={testimonials[testimonialIndex].avatar}
                  width={96}
                  height={96}
                  alt={testimonials[testimonialIndex].name}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="text-sm text-muted-foreground">{testimonials[testimonialIndex].role}</div>
                  <div className="text-lg font-semibold text-card-foreground">{testimonials[testimonialIndex].name}</div>
                  <p className="mt-2 text-muted-foreground">{testimonials[testimonialIndex].text}</p>
                  <div className="mt-3 flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: testimonials[testimonialIndex].rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full ${i === testimonialIndex ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ FEATURES (detailed horizontal cards) ------------------ */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
        <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
          Built for travelers
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureWide
            title="Secure Payments"
            body="Encrypted transactions with PCI-level compliance and multiple payment options like UPI, cards, and wallets."
            icon={<CreditCard />}
            gradient="bg-gradient-to-r from-primary to-accent"
          />
          <FeatureWide
            title="24/7 Support"
            body="Friendly support team available round the clock to help with bookings, cancellations or rescheduling."
            icon={<Phone />}
            gradient="bg-gradient-to-r from-accent to-primary"
          />
        </div>
      </section> 
      <BusShowcase />
      {/* ------------------ FAQ (Accordion) ------------------ */}
      <section id="faq" className="max-w-7xl mx-auto px-6 md:px-8 mt-16 mb-10">
        <motion.h3 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </motion.h3>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((q, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{q.question}</AccordionTrigger>
                <AccordionContent>{q.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ------------------ APP DOWNLOAD CTA (gradient) ------------------ */}
      <section className="mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-accent p-10 text-white shadow-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-3xl font-bold">Book on the go — download the app</h3>
                <p className="mt-3 text-lg">
                  Use our mobile app for faster bookings, deals, and live tracking. Available on Android and iOS.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <a href="#" aria-label="Download on Google Play">
                    <Image src="/images/mobile.png" alt="Google Play" width={160} height={48} />
                  </a>
                  <a href="#" aria-label="Download on the App Store">
                    <Image src="/app-store.png" alt="App Store" width={160} height={48} />
                  </a>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button className="bg-white text-primary rounded-full px-6">Open App</Button>
                  <Button variant="ghost" className="text-white border-white/30 rounded-full px-6">
                    Learn more
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className=" ">
                  <Image
                    src="/images/bus-stop.png"
                    alt="App preview"
                    width={700}
                    height={720}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ FINAL CTA and FOOTER ------------------ */}
      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Ready for your next journey?</h3>
              <p className="text-muted-foreground mt-2">Secure your seat on our premium buses — comfortable, safe, and reliable.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} size="lg" className="rounded-full bg-primary">
                Get Started
              </Button>
              <Button variant="outline" className="rounded-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image width={200} height={200} src="/logo2.png" alt="Logo" className="   mx-auto  flex items-center justify-center text-white font-bold text-sm" />
              {/* <h4 className="text-lg font-semibold">Suhani Travels</h4>
              <p className="text-muted-foreground mt-2">Your journey, our priority. Premium coaches and reliable service across India.</p> */}
              <div className="mt-4 flex gap-3">
                <Button variant="link" asChild><a href="#">Instagram</a></Button>
                <Button variant="link" asChild><a href="#">Facebook</a></Button>
                <Button variant="link" asChild><a href="#">Twitter</a></Button>
              </div>
            </div>

            <div>
              <h5 className="font-semibold">Quick Links</h5>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#popular-routes" className="hover:text-primary">Popular Routes</a></li>
                <li><a href="#fleet" className="hover:text-primary">Our Fleet</a></li>
                <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold">Contact</h5>
              <div className="mt-3 text-sm text-muted-foreground">
                <div>support@suhanitravels.com</div>
                <div className="mt-1">+91 98765 43210</div>
                <div className="mt-2 text-xs">Office: Mumbai, India</div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Suhani Travels. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to top floating button */}
      <ScrollTop />
    </main>
  );
} 

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-xl bg-card p-3 flex items-center gap-3 border border-border shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
} 

function FeatureWide({ title, body, icon, gradient }: { title: string; body: string; icon: ReactNode; gradient?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl p-6 border border-border shadow-sm bg-card flex gap-4"
    >
      <div className={`rounded-lg p-3 ${gradient ?? "bg-muted"} text-white flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{body}</p>
      </div>
    </motion.div>
  );
}

/* ScrollTop button with show/hide on scroll */
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed right-6 bottom-8 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-105 transition"
    >
      <ArrowUp />
    </button>
  );
}
