import { Router } from "express";
import { Trip } from "../models/trip";
import { BusModel, RouteModel, BusScheduleModel } from "../models/bus";
import { UserModel } from "../models/user";
import NodeCache from "node-cache";

const router = Router();
const homeDataCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Static data for testimonials and FAQs (as there are no models for them)
const testimonialsSeed = [
  { id: "t1", name: "Anjali K.", text: "Smooth booking, comfy seats and punctual service. Highly recommend Suhani Travels!", avatar: "/images/user1.jpg", role: "Verified Passenger", rating: 5 },
  { id: "t2", name: "Rohit S.", text: "Premium buses and friendly staff. Booking UI is clean and fast.", avatar: "/images/user2.jpg", role: "Frequent Traveler", rating: 4 },
  { id: "t3", name: "Meera P.", text: "Loved the legroom and recliner seats — best overnight journey I've had.", avatar: "/images/user3.jpg", role: "Tourist", rating: 5 },
  { id: "t4", name: "Suresh P.", text: "Excellent customer support when I needed a change in schedule.", avatar: "/images/user2.jpg", role: "Business Traveler", rating: 4 },
];

const faqItemsSeed = [
  { question: "What payment options do you accept?", answer: "We accept UPI, major debit & credit cards, and net banking. Payment gateway is encrypted and PCI-compliant." },
  { question: "Can I cancel or reschedule my booking?", answer: "Yes — cancellations are allowed per fare rules. Rescheduling fees may apply. Please check your ticket details." },
  { question: "Is seat selection guaranteed?", answer: "Seat selection is subject to availability at booking time. Selected seat is reserved immediately upon confirmation." },
  { question: "Do you provide travel insurance?", answer: "We provide optional travel insurance at checkout — you can enable or disable it before payment." },
];

router.get("/home-data", async (req, res) => {
  try {
    const cachedData = homeDataCache.get("homeData");
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch popular routes (example: top 6 routes by number of trips or a simple limit)
    const popularRoutes = await Trip.aggregate([
      {
        $group: {
          _id: "$route",
          tripCount: { $sum: 1 },
        },
      },
      { $sort: { tripCount: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "routes",
          localField: "_id",
          foreignField: "_id",
          as: "routeInfo",
        },
      },
      { $unwind: "$routeInfo" },
      {
        $project: {
          id: "$routeInfo._id",
          from: { $arrayElemAt: ["$routeInfo.stops.name", 0] },
          to: { $arrayElemAt: ["$routeInfo.stops.name", { $subtract: [{ $size: "$routeInfo.stops" }, 1] }] },
          name: "$routeInfo.name",
          basePrice: "$routeInfo.basePrice",
          distance: "$routeInfo.distance",
        },
      },
    ]);

    // Fetch featured buses
    const featuredBuses = await BusModel.find({ status: 'active' })
      .sort({ rating: -1 })
      .limit(4)
      .select('model type amenities image rating');

    // Fetch statistics
    const totalUsers = await UserModel.countDocuments();
    const totalBuses = await BusModel.countDocuments({ status: 'active' });
    const totalTrips = await Trip.countDocuments(); // Consider only future trips for a more accurate "passengers served"

    // For "passengers served", we can sum up booked seats from past trips
    const passengersServedResult = await Trip.aggregate([
      {
        $match: {
          date: { $lt: new Date() } // Only count past trips
        }
      },
      {
        $group: {
          _id: null,
          totalBookedSeats: { $sum: { $size: "$bookedSeats" } }
        }
      }
    ]);
    const passengersServed = passengersServedResult.length > 0 ? passengersServedResult[0].totalBookedSeats : 0;

    // For "cities covered", we can count unique stop names from all routes
    const citiesCoveredResult = await RouteModel.aggregate([
      { $unwind: "$stops" },
      {
        $group: {
          _id: null,
          uniqueCities: { $addToSet: "$stops.name" }
        }
      },
      {
        $project: {
          _id: 0,
          count: { $size: "$uniqueCities" }
        }
      }
    ]);
    const citiesCovered = citiesCoveredResult.length > 0 ? citiesCoveredResult[0].count : 0;


    const homeData = {
      popularRoutes: popularRoutes.map((route: any) => ({
        id: route.id,
        from: route.from,
        to: route.to,
        price: route.basePrice, // Using basePrice from route as a placeholder
        duration: `${Math.round(route.distance / 50)}h`, // Estimate duration based on distance
        rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Random rating between 4 and 5
        amenities: ["AC", "WiFi", "Charging"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1), // Random amenities
      })),
      featuredBuses,
      testimonials: testimonialsSeed,
      faqItems: faqItemsSeed,
      statistics: {
        passengersServed: passengersServed,
        citiesCovered: citiesCovered,
        busesInFleet: totalBuses,
        yearsInService: 15, // Static for now
      },
    };

    homeDataCache.set("homeData", homeData);
    res.json(homeData);
  } catch (err: unknown) {
    console.error("Error fetching home data:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Failed to fetch home data",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
