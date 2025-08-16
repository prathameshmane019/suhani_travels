"use client";
import { useState, useEffect, useCallback ,useMemo} from 'react';
import { CreditCard, User, Mail, Phone, ArrowLeft, Calendar } from 'lucide-react';
import { api } from '@/lib/utils';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

// Type Definitions
export interface IPassengerDetails {
  name: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  age?: number;
}

export interface IStop {
  name: string;
  sequence: number;
}

export interface IBookingPayload {
  tripId: string;
  userId?: string;
  seatNumbers: string[];
  passengerDetails: IPassengerDetails[];
  totalPrice: number;
  boardingPoint: IStop;
  dropoffPoint: IStop;
}

export interface ITrip {
  _id: string;
  route: {
    name: string;
    from: string;
    to: string;
    duration: string;
    stops: IStop[];
  };
  bus: {
    model: string;
    registrationNumber: string;
  };
  date: string;
  price: number;
  schedule: {
    departureTime: string;
    arrivalTime: string;
  };
}

// Message Box Component
interface MessageBoxProps {
  type: 'success' | 'error' | '';
  message: string;
  onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg max-w-sm w-full z-50 ${bgColor} ${textColor} border ${borderColor} flex items-center`}>
      <span className="text-xl mr-3">{icon}</span>
      <p className="flex-grow">{message}</p>
      <button onClick={onClose} className="text-xl ml-3 font-semibold">&times;</button>
    </div>
  );
};

// Primary Passenger Form Component
const PrimaryPassengerForm = ({ passenger, onChange }: {
  passenger: IPassengerDetails;
  onChange: (field: keyof IPassengerDetails, value: string | number) => void;
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
      <User className="w-5 h-5" />
      Primary Passenger (Lead Contact)
    </h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender *
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Phone className="inline-block h-4 w-4 mr-1 text-gray-500" />
          Phone Number *
        </label>
        <input
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+91 XXXXX XXXXX"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Calendar className="inline-block h-4 w-4 mr-1 text-gray-500" />
          Age *
        </label>
        <input
          type="number"
          min="1"
          max="120"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.age || ''}
          onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
          placeholder="Enter age"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Mail className="inline-block h-4 w-4 mr-1 text-gray-500" />
          Email (Optional)
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter email address"
        />
      </div>
    </div>
  </div>
);

// Other Passenger Form Component
const OtherPassengerForm = ({ passenger, index, seatNumber, onChange }: {
  passenger: IPassengerDetails;
  index: number;
  seatNumber: string;
  onChange: (field: keyof IPassengerDetails, value: string) => void;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h4 className="font-semibold text-gray-700 mb-3">
      Passenger {index + 2} - Seat {seatNumber}
    </h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender *
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={passenger.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  </div>
);

// Main Checkout Page Component
const CheckoutPage: React.FC = () => {
  // Mock URL parameters - in real app, get from useParams and useSearchParams
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [passengerDetails, setPassengerDetails] = useState<IPassengerDetails[]>([]);
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [boardingPoint, setBoardingPoint] = useState<IStop | null>(null);
  const [dropoffPoint, setDropoffPoint] = useState<IStop | null>(null);
  const tripId = params?.id as string;
  const seatNumbers = useMemo(() => {
    return searchParams?.get('seats')?.split(',').filter(Boolean) || [];
  }, [searchParams]);

  const [userId, setUserId] = useState<string | undefined>(undefined);
  // Fetch user data and pre-fill primary passenger details
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Redirect to login page if not authenticated, with callback URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await api.get('/auth/me'); // Assuming this endpoint exists

          const userData = response.data.user;
          console.log('User data fetched:', userData);

          setUserId(userData._id || undefined);

          setPassengerDetails(prev => {
            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              // Assuming gender and age are also part of user data
              gender: userData.gender || 'male',
              age: userData.age || 0,
            };
            return updated;
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Optionally show a toast error
        }
      };
      fetchUserData();
    }
  }, [router]);


  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      const response = await api.get(`/trips/${tripId}`);
      setTrip(response.data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  // Initialize passenger details
  useEffect(() => {
    if (seatNumbers.length > 0 && !isInitialized) {
      const newPassengers: IPassengerDetails[] = seatNumbers.map(() => ({
        name: '',
        gender: 'male' as const,
        phone: '',
        email: '',
        age: 0
      }));
      setPassengerDetails(newPassengers);
      setIsInitialized(true);
    }
  }, [seatNumbers, isInitialized]);

  // Fetch trip details
  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const handlePrimaryPassengerChange = (field: keyof IPassengerDetails, value: string | number) => {
    setPassengerDetails(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], [field]: value };
      return updated;
    });
  };

  const handleOtherPassengerChange = (index: number, field: keyof IPassengerDetails, value: string) => {
    setPassengerDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const showValidationError = (errorMessage: string) => {
    setMessage(errorMessage);
    setMessageType('error');
  };

  const validatePrimaryPassenger = () => {
    const primary = passengerDetails[0];
    if (!primary?.name?.trim()) {
      showValidationError('Please enter the primary passenger name.');
      return false;
    }
    if (!primary?.phone?.trim()) {
      showValidationError('Please enter the primary passenger phone number.');
      return false;
    }
    if (!primary?.age || primary.age < 1) {
      showValidationError('Please enter a valid age for the primary passenger.');
      return false;
    }
    if (!/^\+?[\d\s-()]+$/.test(primary.phone.trim())) {
      showValidationError('Please enter a valid phone number.');
      return false;
    }
    // if (primary?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email?.trim())) {
    //   showValidationError('Please enter a valid email address.');
    //   return false;
    // }
    return true;
  };

  const validateOtherPassengers = () => {
    for (let i = 1; i < passengerDetails.length; i++) {
      const passenger = passengerDetails[i];
      if (!passenger?.name?.trim()) {
        showValidationError(`Please enter the name for passenger ${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const handleDummyPayment = () => {
    if (!validatePrimaryPassenger() || !validateOtherPassengers()) {
      return;
    }

    setPaymentLoading(true);
    setTimeout(() => {
      setIsPaid(true);
      setPaymentLoading(false);
      setMessage('Payment successful! You can now confirm your booking.');
      setMessageType('success');
    }, 2000);
  };

  const handleConfirmBooking = async () => {
    if (!isPaid || !trip || !userId) return;

    // Inline validation
    let isValid = true;
    for (const passenger of passengerDetails) {
      if (!passenger.name.trim() || !passenger.gender) {
        showValidationError('Please fill in all required details for all passengers.');
        isValid = false;
        break;
      }
    }

    if (!isValid) return;

    // Validate boarding and drop-off points
    if (!boardingPoint) {
      showValidationError('Please select a boarding point.');
      return;
    }
    if (!dropoffPoint) {
      showValidationError('Please select a drop-off point.');
      return;
    }

    try {
      setBookingInProgress(true);

      const bookingData: IBookingPayload = {
        tripId: trip._id,
        seatNumbers: seatNumbers,
        passengerDetails: passengerDetails.map(p => ({
          ...p,
          name: p.name.trim(),
          phone: p.phone?.trim() || undefined,
          email: p.email?.trim() || undefined,
        })),
        totalPrice: seatNumbers.length * trip.price,
        boardingPoint: boardingPoint,
        dropoffPoint: dropoffPoint,
        userId: userId,
      };

      const response = await api.post('/bookings', bookingData);

      if (response.status === 201) {
        console.log('Booking confirmed:', response.data.booking);
        setMessage('Booking confirmed successfully! Redirecting to your bookings...');
        setMessageType('success');
        router.push(`/bookings/${response.data.booking._id}`);

      }

    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setBookingInProgress(false);
    }
  };

  // Validation for button states
  const isPrimaryValid = passengerDetails[0]?.name?.trim() &&
    passengerDetails[0]?.phone?.trim() &&
    (passengerDetails[0]?.age ?? 0) > 0;

  const areOthersValid = passengerDetails.length <= 1 ||
    passengerDetails.slice(1).every(p => p.name?.trim());

  const isFormsValid = isPrimaryValid && areOthersValid;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Trip details could not be loaded.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (seatNumbers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Seats Selected</h2>
          <p className="text-gray-600 mb-4">Please select seats before proceeding to checkout.</p>
        </div>
      </div>
    );
  }

  const totalPrice = seatNumbers.length * trip.price;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <MessageBox type={messageType} message={message} onClose={() => setMessage('')} />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => alert('Go back to seat selection')}
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center flex-grow">
            Confirm Your Booking
          </h1>
          <div className="w-6"></div>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Summary */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Booking Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Route:</strong> {trip.route.from} → {trip.route.to}</p>
              <p><strong>Bus:</strong> {trip.bus.model} ({trip.bus.registrationNumber})</p>
              <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</p>
              <p><strong>Departure:</strong> {trip.schedule.departureTime} | <strong>Arrival:</strong> {trip.schedule.arrivalTime}</p>
              <p><strong>Selected Seats:</strong> {seatNumbers.join(', ')}</p>
              <p className="text-lg font-bold text-blue-800">
                <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Passenger Details</h3>

            <div className="space-y-6">
              {/* Primary Passenger */}
              <PrimaryPassengerForm
                passenger={passengerDetails[0] || { name: '', gender: 'male', phone: '', email: '', age: 0 }}
                onChange={handlePrimaryPassengerChange}
              />

              {/* Boarding and Drop-off Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Boarding Point *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={boardingPoint?.name || ''}
                    onChange={(e) => {
                      const selectedStop = trip?.route?.stops.find(
                        (stop) => stop.name === e.target.value
                      );
                      setBoardingPoint(selectedStop || null);
                    }}
                    required
                  >
                    <option value="">Select Boarding Point</option>
                    {trip?.route?.stops.map((stop) => (
                      <option key={stop.name} value={stop.name}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drop-off Point *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={dropoffPoint?.name || ''}
                    onChange={(e) => {
                      const selectedStop = trip?.route?.stops.find(
                        (stop) => stop.name === e.target.value
                      );
                      setDropoffPoint(selectedStop || null);
                    }}
                    required
                  >
                    <option value="">Select Drop-off Point</option>
                    {trip?.route?.stops.map((stop) => (
                      <option key={stop.name} value={stop.name}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other Passengers */}
              {passengerDetails.slice(1).map((passenger, index) => (
                <OtherPassengerForm
                  key={index}
                  passenger={passenger}
                  index={index}
                  seatNumber={seatNumbers[index + 1]}
                  onChange={(field, value) => handleOtherPassengerChange(index + 1, field, value)}
                />
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>

            {isPaid ? (
              <div className="flex items-center justify-center h-24 bg-green-50 rounded-md border border-dashed border-green-300 text-green-700">
                <CreditCard className="h-6 w-6 mr-2" />
                Payment Successful! ✅
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">Demo Payment Gateway</p>
                  <p className="text-sm text-gray-500">Click &quot;Pay Now&quot; to simulate payment processing</p>
                </div>

                <Button
                  onClick={handleDummyPayment}
                  disabled={paymentLoading || bookingInProgress || !isFormsValid}
                  className={`w-full px-8 py-4 bg-blue-600 text-white font `}>
                  {paymentLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay Now ₹${totalPrice.toFixed(2)}`
                  )
                  }

                </Button>
              </div>
            )}
          </div>

          {/* Confirm Booking Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleConfirmBooking}
              disabled={!isPaid || bookingInProgress}
              className={`w-full px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 ${bookingInProgress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}

            >
              {bookingInProgress ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;