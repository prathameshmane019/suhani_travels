
import { Bus } from '@/types';
import { Bus as BusIcon,AirVent, Wifi, CreditCard, Coffee, Star, ArrowRight } from 'lucide-react';


const BusCard = ({ bus, onSelectSeats }: { bus: Bus; onSelectSeats: (bus: Bus) => void }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'ac': return <AirVent className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'charging point': return <CreditCard className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mb-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <BusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{bus.name}</h3>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mt-1">
                {bus.type}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-800 text-lg">{bus.rating}</span>
          </div>
        </div>
        
        {/* Journey Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{bus.departureTime}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Departure</div>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-2"></div>
            <div className="text-lg font-semibold text-slate-600 mb-1">{bus.duration}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Journey Time</div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-2"></div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{bus.arrivalTime}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Arrival</div>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-3 mb-6">
          {bus.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-xl text-sm font-medium text-slate-700 border border-slate-200/50">
              {getAmenityIcon(amenity)}
              {amenity}
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-600">
              <span className={`font-bold ${bus.availableSeats < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {bus.availableSeats} seats available
              </span> out of {bus.totalSeats}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${bus.availableSeats < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${(bus.availableSeats / bus.totalSeats) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">₹{bus.price}</div>
              <div className="text-sm font-medium text-slate-500">per person</div>
            </div>
            <button 
              onClick={() => onSelectSeats(bus)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              Select Seats
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BusCard;