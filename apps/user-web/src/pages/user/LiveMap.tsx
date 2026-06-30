import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { io } from 'socket.io-client';
import { ShieldAlert, Car as CarIcon } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXZhZWxsYWxsYWwiLCJhIjoiY204b2U5Nzg0MDFzbDJtcHAxdGN5MWl4NSJ9.H9WERlS25nf9tn-fzf_Fsw';
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function LiveMap() {
  const { bookingId } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const carMarker = useRef<mapboxgl.Marker | null>(null);
  
  const [driverLoc, setDriverLoc] = useState<{lat: number, lng: number, heading: number}>({ lat: 37.7749, lng: -122.4194, heading: 0 });
  const [eta, setEta] = useState('5 mins');
  const [autoshiftActive, setAutoshiftActive] = useState(false);
  
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/navigation-day-v1', // Modern navigation style
      center: [driverLoc.lng, driverLoc.lat],
      zoom: 14,
      pitch: 45 // 3D perspective
    });

    const el = document.createElement('div');
    el.className = 'w-10 h-10 bg-white rounded-xl shadow-lg border-2 border-primary flex items-center justify-center relative overflow-hidden';
    el.innerHTML = '<svg class="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
    
    carMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([driverLoc.lng, driverLoc.lat])
      .addTo(map.current);

    const socket = io('http://localhost:3005');

    // MOCK: Emit joining room
    socket.emit('subscribe', { rideId: bookingId });

    socket.on('location_update', (data) => {
      setDriverLoc({ lat: data.lat, lng: data.lng, heading: data.heading || 0 });
      setEta(data.eta || 'Updating...');

      if (carMarker.current) {
        carMarker.current.setLngLat([data.lng, data.lat]);
        carMarker.current.setRotation(data.heading || 0);
        map.current?.flyTo({ center: [data.lng, data.lat], speed: 0.5, curve: 1 });
      }
    });

    return () => {
      socket.disconnect();
      map.current?.remove();
    };
  }, [bookingId]);

  const handleEmergency = () => {
    setAutoshiftActive(true);
    // In real app, call Autoshift Service
    setTimeout(() => {
      alert("AutoShift triggered! Reassigning driver seamlessly. You will not lose your current booking state.");
      setAutoshiftActive(false);
    }, 1000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] mt-16 overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* HUD UI */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-text">Driver Arriving</h2>
              <p className="text-primary font-bold text-lg">{eta} away</p>
            </div>
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner">
              <CarIcon className="w-7 h-7 text-gray-700" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
            <img src="https://i.pravatar.cc/150?u=driver1" className="w-12 h-12 rounded-full shadow-sm" alt="Driver" />
            <div>
              <p className="font-bold text-text">Michael Chen</p>
              <p className="text-sm text-text-muted flex items-center gap-1">4.9 ★ • Tesla Model 3</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-mono bg-gray-100 px-2 py-1 rounded-lg text-sm font-bold border border-gray-200">XYZ-987</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button 
              onClick={handleEmergency}
              disabled={autoshiftActive}
              className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <ShieldAlert className="w-5 h-5" /> 
              {autoshiftActive ? 'Shifting...' : 'AutoShift'}
            </button>
            <button className="flex-1 py-3 bg-text text-white font-bold rounded-xl hover:bg-gray-800 transition">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
