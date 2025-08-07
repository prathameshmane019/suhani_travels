"use client";
import { Bus, Seat } from "@/types";
import { useState } from "react";
import { ArrowLeft, User, Phone, Shield } from 'lucide-react';
const PaymentForm = ({ selectedSeats, bus, onBack }: { selectedSeats: Seat[]; bus: Bus; onBack: () => void }) => {
  const [passengerDetails, setPassengerDetails] = useState(
    selectedSeats.map((_, index) => ({
      name: '',
      age: '',
      gender: 'Male',
      phone: index === 0 ? '' : ''
    }))
  );

  const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Complete Your Booking</h2>
            <p className="text-slate-600 font-medium">Enter passenger details and payment information</p>
          </div>
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to seats
          </button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Passenger Details */}
          <div className="xl:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Passenger Information
            </h3>
            
            {passengerDetails.map((passenger, index) => (
              <div key={index} className="bg-slate-50/80 rounded-3xl p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-lg">
                  Passenger {index + 1} (Seat {selectedSeats[index]?.number})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                    <input 
                      type="text"
                      placeholder="Enter full name"
                      className="w-full p-4 border-0 bg-white/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
                      value={passenger.name}
                      onChange={(e) => {
                        const updated = [...passengerDetails];
                        updated[index].name = e.target.value;
                        setPassengerDetails(updated);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Age</label>
                    <input 
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="100"
                      className="w-full p-4 border-0 bg-white/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
                      value={passenger.age}
                      onChange={(e) => {
                        const updated = [...passengerDetails];
                        updated[index].age = e.target.value;
                        setPassengerDetails(updated);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Gender</label>
                    <select 
                      className="w-full p-4 border-0 bg-white/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
                      value={passenger.gender}
                      onChange={(e) => {
                        const updated = [...passengerDetails];
                        updated[index].gender = e.target.value;
                        setPassengerDetails(updated);
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {index === 0 && (
                    <div className="space-y-2">
                      <label className=" text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        Phone Number
                      </label>
                      <input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full p-4 border-0 bg-white/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
                        value={passenger.phone}
                        onChange={(e) => {
                          const updated = [...passengerDetails];
                          updated[index].phone = e.target.value;
                          setPassengerDetails(updated);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Booking Summary & Payment */}
          <div className="space-y-6">
            {/* Trip Summary */}
            <div className="bg-slate-50/80 rounded-3xl p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Trip Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Route</span>
                  <span className="font-bold text-slate-800">Pandharpur → Pune</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Bus</span>
                  <span className="font-bold text-slate-800">{bus.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Departure</span>
                  <span className="font-bold text-slate-800">{bus.departureTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Seats</span>
                  <span className="font-bold text-slate-800">{selectedSeats.map(s => s.number).join(', ')}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-lg">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Options */}
            <div className="bg-slate-50/80 rounded-3xl p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:bg-white/60 hover:border-emerald-300 transition-all duration-200">
                  <input type="radio" name="payment" value="upi" defaultChecked className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-slate-800">UPI Payment</span>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:bg-white/60 hover:border-emerald-300 transition-all duration-200">
                  <input type="radio" name="payment" value="card" className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-slate-800">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:bg-white/60 hover:border-emerald-300 transition-all duration-200">
                  <input type="radio" name="payment" value="netbanking" className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-slate-800">Net Banking</span>
                </label>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              Pay Securely - ₹{totalAmount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;