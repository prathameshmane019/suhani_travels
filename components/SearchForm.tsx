import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
// Components
const SearchForm = ({ onSearch }: { onSearch: (data: any) => void }) => {
  const [searchData, setSearchData] = useState({
    from: 'Pandharpur',
    to: 'Pune',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              From
            </label>
            <select 
              className="w-full p-4 border-0 bg-slate-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
              value={searchData.from}
              onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
            >
              <option value="Pandharpur">Pandharpur</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              To
            </label>
            <select 
              className="w-full p-4 border-0 bg-slate-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
              value={searchData.to}
              onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
            >
              <option value="Pune">Pune</option>
              <option value="Pandharpur">Pandharpur</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              Journey Date
            </label>
            <input 
              type="date"
              className="w-full p-4 border-0 bg-slate-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
              value={searchData.date}
              onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              Passengers
            </label>
            <select 
              className="w-full p-4 border-0 bg-slate-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 font-medium text-slate-800"
              value={searchData.passengers}
              onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => onSearch(searchData)}
          className="w-full mt-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
        >
          <Search className="w-5 h-5" />
          Search Buses
        </button>
      </div>
    </div>
  );
};
export default SearchForm;