"use client";
import { useState, useRef } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  CheckCircle, 
  Download,
  QrCode,
  Ticket, 
} from 'lucide-react';

// Define IBooking interface (copy from bookings/page.tsx for consistency)
interface IBooking {
  _id: string; 
  boardingPoint: { name: string; sequence: number };
  dropoffPoint: { name: string; sequence: number };
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  seats: string[];
  passenger: {
    name: string;
    phone: string;
    email?: string;
  };
  bus: {
    registrationNumber: string;
    busModel: string;
    type: string; 
  };
  route: {
    from: string;
    to: string;
    duration: string;
  };
  schedule: {
    endTime: string;
    startTime: string;
  };
  tripId: {
    _id: string;
    date: string;
  };
}
const TicketComponent = ({ booking }: { booking: IBooking }) => {
  console.log('Booking Data:', booking);
  
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString:string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const printWindow = window.open('', '_blank');
      const ticketContent = ticketRef.current?.innerHTML;
      
      printWindow?.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bus Ticket - ${sampleBooking.bookingId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; padding: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: A4; margin: 10mm; }
              }
            </style>
          </head>
          <body>
            ${ticketContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
        </html>
      `);
      printWindow?.document.close();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please use your browser\'s print option and save as PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Sample booking data
  const sampleBooking = booking

  return ( 
      <div className="mt-15 bg-white rounded-xl  w-full  overflow-auto">
        {/* Single Header with Download */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Bus Ticket</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Opening...' : 'Download PDF'}
            </button> 
          </div>
        </div>

        {/* Compact Ticket Content */}
        <div ref={ticketRef} className="bg-white p-6">
          {/* Compact Header */}
          <div className="bg-blue-600 rounded-lg px-6 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">ST</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SUHANI TRAVELS</h1>
                  <p className="text-blue-100 text-sm">Your Journey, Our Commitment</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-green-500">
                <div className="flex items-center gap-1 text-white">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-bold text-sm uppercase">{sampleBooking.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Reference */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <Ticket className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">BUS TICKET</span>
            </div>
            <div className="mt-2">
              <p className="text-gray-600 text-sm">Booking Reference</p>
              <p className="text-xl font-bold text-blue-600">{sampleBooking.bookingId}</p>
            </div>
          </div>

          {/* Compact Journey Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* From */}
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">DEPARTURE</p>
                <h3 className="text-lg font-bold text-gray-900">{sampleBooking.route.from}</h3>
                <p className="text-xl font-bold text-blue-600 ">{formatTime(sampleBooking.schedule.startTime)}</p>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-0.5 bg-blue-500 w-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-2 py-1 rounded border border-blue-400">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Let's display boarding and dropoff and date in beautiful manner */}
                
                <p className="text-xs text-gray-600 my-4">TRAVEL DATE</p>
                <p className="text-sm font-bold text-gray-900">{formatDate(sampleBooking.travelDate)}</p>
                <p className="text-sm text-blue-600 font-medium">{sampleBooking.route.duration}</p>
                <p className="text-xs text-gray-600  ">Boarding: {sampleBooking.boardingPoint.name} (Seq: {sampleBooking.boardingPoint.sequence})</p>
                <p className="text-xs text-gray-600">Dropoff: {sampleBooking.dropoffPoint.name} (Seq: {sampleBooking.dropoffPoint.sequence})</p>
              </div>

              {/* To */}
              <div className="text-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">ARRIVAL</p>
                <h3 className="text-lg font-bold text-gray-900">{sampleBooking.route.to}</h3>
                <p className="text-xl font-bold text-green-600">{formatTime(sampleBooking.schedule.endTime)}</p>
              </div>
            </div>
          </div>

          {/* Compact Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Bus Details</span>
              </div>
              <p className="font-bold text-gray-900">{sampleBooking.bus.busModel}</p>
              <p className="text-sm text-gray-600">{sampleBooking.bus.registrationNumber}</p>
              <p className="text-xs text-blue-600 font-medium capitalize">{sampleBooking.bus?.type?.replace('-', ' ')}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Payment</span>
              </div>
              <p className="font-bold text-gray-900">₹{sampleBooking.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Seat: {sampleBooking.seats.join(', ')}</p>
              <p className="text-xs text-green-600 font-medium capitalize">{sampleBooking.paymentStatus}</p>
            </div>
          </div>

          {/* Compact Passenger Details */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Passenger Details</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{sampleBooking.passenger.name}</h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span className="text-sm">{sampleBooking.passenger.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="border-t border-dashed border-gray-300 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">Scan to verify</p>
              </div>
              
              <div className="flex-1 ml-6">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Instructions</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Arrive 15 min before departure</li>
                  <li>• Carry valid ID proof</li>
                  <li>• Support: +91-XXXX-XXXX-XX</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-4 pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900">Suhani Travels - Making your journey comfortable and safe</p>
              <p className="text-xs text-gray-500 mt-1">This is a computer generated ticket. No signature required.</p>
            </div>
          </div>
        </div>
      </div> 
  );
};

export default TicketComponent;