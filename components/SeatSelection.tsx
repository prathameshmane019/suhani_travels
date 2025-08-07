import { Bus, Seat } from '@/types';
import {  CheckCircle,ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
const SeatSelection = ({ bus, onBack, onConfirm }: { bus: Bus; onBack: () => void; onConfirm: (seats: Seat[]) => void }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const seatLayout: Seat[] = [];
    for (let i = 1; i <= bus.totalSeats; i++) {
      seatLayout.push({
        id: `seat-${i}`,
        number: `${i}`,
        isBooked: Math.random() > 0.7,
        isSelected: false,
        type: i <= 10 ? 'premium' : 'regular',
        price: i <= 10 ? bus.price + 100 : bus.price
      });
    }
    setSeats(seatLayout);
  }, [bus]);

  const toggleSeat = (seatId: string) => {
    const updatedSeats = seats.map(seat => {
      if (seat.id === seatId && !seat.isBooked) {
        return { ...seat, isSelected: !seat.isSelected };
      }
      return seat;
    });
    setSeats(updatedSeats);
    setSelectedSeats(updatedSeats.filter(seat => seat.isSelected));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Select Your Seats</h2>
            <p className="text-slate-600 font-medium">{bus.name} • {bus.type}</p>
          </div>
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to buses
          </button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Seat Layout */}
          <div className="xl:col-span-3">
            <div className="bg-slate-50/80 rounded-3xl p-6 md:p-8">
              {/* Driver Section */}
              <div className="text-center mb-8">
                <div className="w-20 h-10 bg-slate-700 rounded-t-2xl mx-auto mb-3 relative">
                  <div className="absolute inset-x-2 top-2 h-6 bg-slate-600 rounded-lg"></div>
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Driver</div>
              </div>
              
              {/* Seats Grid */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat.id)}
                    disabled={seat.isBooked}
                    className={`
                      aspect-square rounded-xl border-2 font-bold text-sm transition-all duration-200 relative overflow-hidden
                      ${seat.isBooked 
                        ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed' 
                        : seat.isSelected
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105'
                          : seat.type === 'premium'
                            ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:shadow-md'
                            : 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 hover:shadow-md'
                      }
                    `}
                  >
                    {seat.number}
                    {seat.type === 'premium' && !seat.isBooked && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-bl-lg"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded-lg"></div>
                  <span className="text-slate-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-100 border-2 border-amber-300 rounded-lg relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-400 rounded-bl-sm"></div>
                  </div>
                  <span className="text-slate-700">Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-lg"></div>
                  <span className="text-slate-700">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-300 border-2 border-slate-400 rounded-lg"></div>
                  <span className="text-slate-700">Booked</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-slate-50/80 rounded-3xl p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Selected Seats</span>
                  <span className="font-bold text-slate-800">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : 'None'}
                  </span>
                </div>
                
                {selectedSeats.length > 0 && (
                  <>
                    <div className="border-t border-slate-200 pt-4">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600">
                            Seat {seat.number} ({seat.type})
                          </span>
                          <span className="text-sm font-semibold text-slate-800">₹{seat.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">Total Amount</span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length === 0}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatSelection;