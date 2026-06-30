import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, Search, Star, Info, ShieldCheck, Car } from 'lucide-react';
import { matchingApi } from '../../services/api';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { LocationSearch, useMapboxRoute } from '@carpool/shared-ui';
import type { Location } from '@carpool/shared-ui';


export default function SearchRide() {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [source, setSource] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [rides, setRides] = useState<any[]>([]);

  useMapboxRoute(mapContainer, map, source, destination);

  useEffect(() => {
    if (!source || !destination || !searched) return;
    
    // Connect to Matching Service WebSocket through API Gateway
    const socket = io('http://localhost:3000', { path: '/api/v1/matchings/socket.io' });
    
    socket.on('connect', () => {
      socket.emit('subscribe_search', { source: source.name, destination: destination.name, date });
    });

    socket.on('new_ride', (ride: any) => {
      // Ignore if seats are fewer than requested
      if ((ride.availableSeats || ride.available_seats) < passengers) return;
      
      const newRide = {
        id: ride.id,
        driverName: ride.driverName || ride.driver_name || 'Driver',
        driverRating: 4.8,
        vehicle: ride.vehicleDetails || ride.vehicle_details || 'Car',
        availableSeats: ride.availableSeats || ride.available_seats,
        price: ride.pricePerSeat || ride.price_per_seat || ride.price || 10,
        departureTime: ride.departureTime || ride.departure_time,
        estimatedArrival: ride.estimatedArrivalTime || ride.estimated_arrival_time,
        distance: ride.distance ? `${(ride.distance / 1000).toFixed(1)} km` : 'Unknown',
        duration: 'N/A',
        offeredSeats: ride.offeredSeats || ride.offered_seats || [],
        availableSeatsList: ride.availableSeatsList || ride.available_seats_list || []
      };

      setRides(prev => {
        // Prevent duplicate rides
        if (prev.some(r => r.id === newRide.id)) return prev;
        const newRides = [newRide, ...prev];
        toast.success('New ride matching your search has been published!');
        return newRides.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [source, destination, date, passengers, searched]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) {
      toast.error('Please select source and destination from the dropdown suggestions');
      return;
    }
    
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await matchingApi.get('/search', {
        params: {
          source: source.name,
          destination: destination.name,
          date,
          passengers
        }
      });
      // Filter out rides that don't have enough seats, though backend should ideally handle it
      const fetchedRides = res.data.data.map((ride: any) => ({
        id: ride.id,
        driverName: ride.driverName || ride.driver_name || 'Driver',
        driverRating: 4.8, // Mock for now until we have rating service
        vehicle: ride.vehicleDetails || ride.vehicle_details || 'Car',
        availableSeats: ride.availableSeats || ride.available_seats,
        price: ride.pricePerSeat || ride.price_per_seat || ride.price || 10,
        departureTime: ride.departureTime || ride.departure_time,
        estimatedArrival: ride.estimatedArrivalTime || ride.estimated_arrival_time,
        distance: ride.distance ? `${(ride.distance / 1000).toFixed(1)} km` : 'Unknown',
        duration: 'N/A',
        offeredSeats: ride.offeredSeats || ride.offered_seats || [],
        availableSeatsList: ride.availableSeatsList || ride.available_seats_list || []
      }));
      setRides(fetchedRides.filter((r: any) => r.availableSeats >= passengers));
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to find rides. Please try again.');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHoverRide = (_rideId: string) => {
    // Future: Highlight specific alternative route based on ride
    if (map.current && source && destination) {
      // Just a mock interaction effect (e.g. slight map movement to simulate focus)
      const bounds = new mapboxgl.LngLatBounds([source.lng, source.lat], [destination.lng, destination.lat]);
      map.current.fitBounds(bounds, { padding: 80, duration: 800 });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
      
      {/* Left Column: Form & Results */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar border-r border-gray-200 bg-white shadow-xl z-10 relative">
        <div className="p-6 md:p-8 shrink-0">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Find a Ride</h1>
            <p className="text-gray-500 mt-2">Millions of rides, one click away.</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative z-50">
              <LocationSearch placeholder="Leaving from..." onSelect={setSource} />
            </div>
            <div className="relative z-40">
              <LocationSearch placeholder="Going to..." onSelect={setDestination} />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-30">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-medium" 
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Return (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={returnDate} 
                    onChange={e => setReturnDate(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-20">
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={passengers}
                    onChange={e => setPassengers(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-medium appearance-none"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 flex items-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-[46px] bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Search className="w-5 h-5"/> Search</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="flex-1 bg-gray-50/50 p-6 md:p-8">
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          )}

          {!loading && searched && rides.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">{rides.length} rides available</h3>
                <span className="text-sm text-gray-500">Sorted by Departure Time</span>
              </div>
              {rides.map((ride, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={ride.id} 
                  onMouseEnter={() => handleHoverRide(ride.id)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                        {ride.driverName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          {ride.driverName}
                          <span className="flex items-center text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500"/> {ride.driverRating}
                          </span>
                        </h4>
                        <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <Car className="w-4 h-4"/> {ride.vehicle}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900">${ride.price}</div>
                      <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block mt-1">
                        {ride.availableSeats} seats left
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-4 border-l-2 border-gray-200 ml-6 py-2 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-white border-2 border-gray-800 rounded-full"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-sm font-medium text-gray-500 max-w-[150px] truncate">{source?.name.split(',')[0] || 'Source'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 absolute left-4 top-1/2 -translate-y-1/2">
                      <Clock className="w-3 h-3"/> {ride.duration}
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{new Date(ride.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-sm font-medium text-gray-500 max-w-[150px] truncate">{destination?.name.split(',')[0] || 'Destination'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-green-500"/> Verified Driver
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Real logic here
                        navigate(`/payment/${ride.id}`);
                      }}
                      className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && searched && rides.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-gray-900">No routes available</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                We couldn't find any drivers heading that way right now. Try adjusting your dates or locations!
              </p>
            </motion.div>
          )}

          {!loading && !searched && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-10">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Enter your destination to see available rides</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column / Mobile Bottom: Map */}
      <div className="flex-1 w-full lg:w-auto h-[400px] lg:h-[calc(100vh-64px)] relative bg-gray-100 z-0">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>

    </div>
  );
}
