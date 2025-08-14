'use client';

import { useState, useEffect } from 'react'; 
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Seat {
  id: string;
  status: 'available' | 'booked' | 'selected';
  type: 'regular' ;
  price: number;
}

interface SeatSelectionProps {
  totalSeats: number;
  price: number; // Base price per seat
  bookedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  selectedSeats: string[];
}

// Function to generate a seat layout with numerical IDs
const generateSeatLayout = (
  totalSeats: number,
  basePrice: number,
  bookedSeats: string[]
): Seat[][] => {
  const layout: Seat[][] = []; 
  const seatsPerRow = 4; // 2+2 configuration
   

  // Calculate rows, considering the last row might have 5 seats
  // Assuming a standard bus has 4 seats per row, except possibly the last row.
  // Let's make it simple: all rows have 4 seats, except the very last one if totalSeats % 4 != 0
  // Or, if totalSeats is a multiple of 4, the last row also has 4 seats.
  // For a 2+2 layout, we'll have 2 seats, aisle, 2 seats.

  let currentRowSeats: Seat[] = [];
  for (let i = 1; i <= totalSeats; i++) {
    const seatId = i.toString();
    
    const status: Seat['status'] = bookedSeats.includes(seatId) ? 'booked' : 'available';
     
    currentRowSeats.push({
      id: seatId,
      status,
      type:   'regular',
      price: basePrice,
    });

    // If current row is full (4 seats) or it's the last seat
    if (currentRowSeats.length === seatsPerRow || i === totalSeats) {
      layout.push(currentRowSeats);
      currentRowSeats = [];
    }
  }

  return layout;
};

const SeatSelection: React.FC<SeatSelectionProps> = ({
  totalSeats,
  price,
  bookedSeats,
  onSeatSelect,
  selectedSeats: propSelectedSeats,
}) => {
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<Seat[]>([]);

  const [seatLayout, setSeatLayout] = useState<Seat[][]>([]);

  useEffect(() => {
    setSeatLayout(generateSeatLayout(totalSeats, price, bookedSeats));
  }, [totalSeats, price, bookedSeats]);

  useEffect(() => {
    // Initialize internal state with propSelectedSeats
    const initialSelected = seatLayout.flat().filter(seat => propSelectedSeats.includes(seat.id));
    setCurrentSelectedSeats(initialSelected);
  }, [propSelectedSeats, seatLayout]); // Depend on seatLayout to ensure seats are available

  const handleSeatToggle = (seat: Seat) => {
    if (seat.status === 'booked') {
      toast.info('This seat is already booked.');
      return;
    }

    const newSelectedSeats = currentSelectedSeats.some((s) => s.id === seat.id)
      ? currentSelectedSeats.filter((s) => s.id !== seat.id)
      : [...currentSelectedSeats, seat];

    setCurrentSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats.map((s) => s.id)); // Pass back string IDs
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Bus Layout</h2>
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
            Driver
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((seat, seatIndex) => (
                <div key={seat.id} className="flex items-center">
                  {/* Aisle space after 2nd seat for 2+2 layout */}
                  {seatIndex === 2 && <div className="w-8"></div>}
                  <Button
                    variant="outline"
                    className={`
                      w-12 h-12 rounded-md text-sm font-medium
                      ${seat.status === 'available' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                      ${seat.status === 'booked' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : ''}
                      ${currentSelectedSeats.some(s => s.id === seat.id) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    `}
                    onClick={() => handleSeatToggle(seat)}
                    disabled={seat.status === 'booked'}
                  >
                    {seat.id}
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-3">Seat Legend:</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <span className="w-5 h-5 bg-green-500 rounded-sm mr-2"></span> Available
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 bg-gray-400 rounded-sm mr-2"></span> Booked
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-sm mr-2"></span> Selected
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
