"use client"; 
import { Bus as Bus1, Shield, Clock, Star,ArrowLeft } from 'lucide-react';
import BusCard from "@/components/BusCard";
import SearchForm from "@/components/SearchForm";
import SeatSelection from "@/components/SeatSelection";
import PaymentForm from "@/components/PayementForm";
import { Bus, Route, Seat } from "@/types";
import { useState } from "react";



// Sample data
const routes: Route[] = [
  {
    id: '1',
    from: 'Pandharpur',
    to: 'Pune',
    buses: [
      {
        id: 'b1',
        name: 'Shivneri Express',
        type: 'ac-sleeper',
        departureTime: '08:00',
        arrivalTime: '12:30',
        duration: '4h 30m',
        price: 450,
        rating: 4.5,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Water'],
        availableSeats: 15,
        totalSeats: 40,
        status: 'active',
        createdAt: new Date() ,
        updatedAt: new Date() 
      },
      {
        id: 'b2',
        name: 'Maharashtra Travels',
        type: 'non-ac-sleeper',
        departureTime: '14:00',
        arrivalTime: '18:00',
        duration: '4h 00m',
        price: 250,
        rating: 4.2,
        amenities: ['Charging Point', 'Water'],
        availableSeats: 8,
        totalSeats: 45,
        status: 'active',
        createdAt: new Date() ,
        updatedAt: new Date()
      }
    ]
  }
];
// Main App Component
const BusBookingApp = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'results' | 'seats' | 'payment'>('search');
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSearch = (searchData: any) => {
    setSearchResults(routes);
    setCurrentStep('results');
  };

  const handleSelectSeats = (bus: Bus) => {
    setSelectedBus(bus);
    setCurrentStep('seats');
  };

  const handleConfirmSeats = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setCurrentStep('payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Bus1 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                BusYatra
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200">
                Login
              </button>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'search' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Your Journey
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Comfortable, safe, and affordable bus travel across Maharashtra with real-time booking
              </p>
            </div>
            
            <SearchForm onSearch={handleSearch} />
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Booking</h3>
                <p className="text-slate-600">100% secure payment gateway with multiple payment options</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Real-time Tracking</h3>
                <p className="text-slate-600">Live bus tracking and seat availability updates</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Premium Service</h3>
                <p className="text-slate-600">Comfortable buses with modern amenities and excellent service</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Available Buses</h2>
                <p className="text-slate-600 font-medium">Pandharpur to Pune • {new Date().toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setCurrentStep('search')}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Modify Search
              </button>
            </div>
            
            <div className="space-y-6">
              {searchResults[0]?.buses.map(bus => (
                <BusCard key={bus.id} bus={bus} onSelectSeats={handleSelectSeats} />
              ))}
            </div>
          </div>
        )}

        {currentStep === 'seats' && selectedBus && (
          <SeatSelection 
            bus={selectedBus} 
            onBack={() => setCurrentStep('results')}
            onConfirm={handleConfirmSeats}
          />
        )}

        {currentStep === 'payment' && selectedBus && (
          <PaymentForm 
            selectedSeats={selectedSeats}
            bus={selectedBus}
            onBack={() => setCurrentStep('seats')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Bus1 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">BusYatra</h3>
              </div>
              <p className="text-slate-400">Your trusted travel partner across Maharashtra</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Popular Routes</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Pune to Mumbai</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mumbai to Pune</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pandharpur to Pune</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-slate-400">
                <p>📞 +91 98765 43210</p>
                <p>✉️ support@busyatra.com</p>
                <p>📍 Pune, Maharashtra</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BusYatra. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusBookingApp;