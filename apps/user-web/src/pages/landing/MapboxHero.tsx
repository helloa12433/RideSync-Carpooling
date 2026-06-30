import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Car as CarIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_ROUTES = [
  { startName: 'Espoo', endName: 'Helsinki', start: [24.6559, 60.2055], end: [24.9384, 60.1699] },
  { startName: 'Los Angeles', endName: 'San Francisco', start: [-118.2437, 34.0522], end: [-122.4194, 37.7749] },
  { startName: 'Mumbai', endName: 'Delhi', start: [72.8777, 19.0760], end: [77.2090, 28.6139] },
  { startName: 'Tokyo', endName: 'Osaka', start: [139.6917, 35.6895], end: [135.5023, 34.6937] },
  { startName: 'Stockholm', endName: 'Oslo', start: [18.0686, 59.3293], end: [10.7522, 59.9139] },
  { startName: 'Copenhagen', endName: 'Berlin', start: [12.5683, 55.6761], end: [13.4050, 52.5200] }
];

function getBearing(start: number[], end: number[]) {
  const startLat = (start[1] * Math.PI) / 180;
  const startLng = (start[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;
  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export default function MapboxHero() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const startMarker = useRef<mapboxgl.Marker | null>(null);
  const endMarker = useRef<mapboxgl.Marker | null>(null);
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [eta, setEta] = useState(0);
  const [distance, setDistance] = useState(0);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeRoute = DEMO_ROUTES[activeRouteIndex];

  const createMarkerEl = (type: 'source' | 'destination' | 'vehicle') => {
    const el = document.createElement('div');
    if (type === 'source') {
      el.className = 'w-5 h-5 bg-[#10b981] border-[3px] border-white rounded-full shadow-md';
    } else if (type === 'destination') {
      el.className = 'w-5 h-5 bg-[#ef4444] border-[3px] border-white rounded-full shadow-md';
    } else {
      el.className = 'car-marker w-6 h-12 bg-gray-900 border-2 border-white rounded-lg shadow-xl relative';
      el.innerHTML = `
        <div class="absolute top-1 left-0.5 w-1.5 h-2 bg-yellow-300 rounded-sm"></div>
        <div class="absolute top-1 right-0.5 w-1.5 h-2 bg-yellow-300 rounded-sm"></div>
        <div class="absolute inset-x-1 top-3 bottom-3 bg-gray-800 rounded-sm"></div>
      `;
    }
    return el;
  };

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true); return;
    }
    
    if (!map.current) {
      mapboxgl.accessToken = token;
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: activeRoute.start as [number, number],
        zoom: 4,
        pitch: 45,
        bearing: 0,
        interactive: false,
        antialias: true
      });

      map.current.on('error', (e) => {
        setErrorMessage(prev => prev ? prev + ' | ' + e.error?.message : 'Map Error: ' + e.error?.message);
      });

      map.current.on('style.load', () => {
        try {
          // 3D Buildings
          if (!map.current!.getLayer('3d-buildings')) {
            map.current!.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#e2e8f0',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.8
              }
            });
          }
        } catch (e) {
          console.error("Failed to add 3D buildings layer:", e);
        }

        try {
          if (!map.current!.getSource('route')) {
            map.current!.addSource('route', {
              type: 'geojson',
              data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }
            });

            // Background wide line
            map.current!.addLayer({
              id: 'route-line-bg',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#3b82f6', 'line-width': 8, 'line-opacity': 0.4 }
            });

            // Foreground solid line
            map.current!.addLayer({
              id: 'route-line-fg',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#2563eb', 'line-width': 4 }
            });
          }
        } catch (e) {
          console.error("Failed to add route layers:", e);
        }
      });

      // Create markers immediately (they are DOM elements, independent of style)
      try {
        if (!startMarker.current) {
          const r = DEMO_ROUTES[activeRouteIndex];
          startMarker.current = new mapboxgl.Marker({ element: createMarkerEl('source') })
            .setLngLat(r.start as [number, number])
            .addTo(map.current!);
            
          endMarker.current = new mapboxgl.Marker({ element: createMarkerEl('destination') })
            .setLngLat(r.end as [number, number])
            .addTo(map.current!);
            
          vehicleMarker.current = new mapboxgl.Marker({ element: createMarkerEl('vehicle'), rotationAlignment: 'map' })
            .setLngLat(r.start as [number, number])
            .addTo(map.current!);
        }
      } catch (e) {
        console.error("Failed to add markers:", e);
      }

      // Start animation immediately
      loadAndAnimateRoute();
    } else {
      loadAndAnimateRoute();
    }

    function loadAndAnimateRoute() {
      setIsTransitioning(false);
      
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      const r = DEMO_ROUTES[activeRouteIndex];
      startMarker.current!.setLngLat(r.start as [number, number]);
      endMarker.current!.setLngLat(r.end as [number, number]);
      vehicleMarker.current!.setLngLat(r.start as [number, number]);
      
      const bounds = new mapboxgl.LngLatBounds(r.start as [number, number], r.start as [number, number]);
      bounds.extend(r.end as [number, number]);

      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${r.start[0]},${r.start[1]};${r.end[0]},${r.end[1]}?geometries=geojson&access_token=${token}`)
        .then(res => res.json())
        .then(data => {
          let coords = data.routes && data.routes[0] && data.routes[0].geometry.coordinates.length >= 2 
            ? data.routes[0].geometry.coordinates 
            : [r.start, r.end];
          coords.forEach((c: number[]) => bounds.extend(c as [number, number]));
          
          // Fit bounds to keep both source and destination in view comfortably
          map.current!.fitBounds(bounds, { padding: { top: 120, bottom: 120, left: 120, right: 350 }, duration: 1000, pitch: 45 });

          const source = map.current!.getSource('route') as mapboxgl.GeoJSONSource;
          if (source) source.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });

          // Start animation after camera settles
          setTimeout(() => {
            animateVehicle(coords);
          }, 1000);
        })
        .catch(err => {
          setErrorMessage('Fetch error: ' + err.message);
          // Fallback to straight line
          let coords = [r.start, r.end];
          animateVehicle(coords);
        });
    }

    function animateVehicle(coords: number[][]) {
      let currentSegment = 0;
      let progress = 0;
      const durationSeconds = 6; // 6 seconds per journey
      const totalFrames = durationSeconds * 60; 
      const speed = coords.length / totalFrames;

      function frame() {
        if (!map.current || !vehicleMarker.current) return;

        progress += speed;
        while (progress >= 1) { progress -= 1; currentSegment++; }

        if (currentSegment >= coords.length - 1) {
          // Reached destination
          vehicleMarker.current.setLngLat(coords[coords.length - 1] as [number, number]);
          setEta(0); setDistance(0);
          
          setIsTransitioning(true);
          setTimeout(() => {
            setActiveRouteIndex((prev) => (prev + 1) % DEMO_ROUTES.length);
          }, 1000); // Wait 1 second before next route
          return;
        }

        const start = coords[currentSegment];
        const end = coords[currentSegment + 1];
        const lng = start[0] + (end[0] - start[0]) * progress;
        const lat = start[1] + (end[1] - start[1]) * progress;

        vehicleMarker.current.setLngLat([lng, lat]);
        vehicleMarker.current.setRotation(getBearing(start, end));

        // Slightly adjust camera to keep car centered horizontally but don't zoom in/out aggressively
        // map.current.panTo([lng, lat], { duration: 0 }); 
        // Note: panning continuously can cause stutter and lose the full route view.
        // The instructions say: "keep both Source and Destination visible whenever possible. Do not zoom in too much."
        // We achieved this with `fitBounds` earlier, so we can just leave the camera static, which looks exactly like viewing the full route on Uber.

        const remSegs = (coords.length - 1) - currentSegment;
        setEta(Math.max(1, Math.round((remSegs / coords.length) * 45)));
        setDistance(Math.max(0.1, (remSegs / coords.length) * 35));

        animationRef.current = requestAnimationFrame(frame);
      }
      animationRef.current = requestAnimationFrame(frame);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeRouteIndex]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-[#e5e7eb]">
      {tokenMissing && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mapbox Token Required</h3>
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-0 inset-x-0 z-50 bg-red-500 text-white p-2 text-xs font-bold whitespace-pre-wrap break-words">
          {errorMessage}
        </div>
      )}
      
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full transition-opacity duration-1000" 
        style={{ opacity: isTransitioning ? 0 : 1 }} 
      />

      {/* Floating Uber-Style Tracking Card */}
      {!tokenMissing && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeRouteIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-80 z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl font-black text-gray-900">{eta}<span className="text-lg text-gray-500 font-semibold ml-1">min</span></p>
                <p className="text-sm text-gray-500 font-medium">{distance.toFixed(1)} km remaining</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <CarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                <p className="text-sm font-semibold text-gray-900 flex-1 truncate">{activeRoute.startName}</p>
              </div>
              
              <div className="w-0.5 h-4 bg-gray-200 ml-[4.5px]" />
              
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                <p className="text-sm font-semibold text-gray-900 flex-1 truncate">{activeRoute.endName}</p>
              </div>
            </div>
            
            <div className="mt-5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.max(5, 100 - (distance / 35) * 100)}%` }} />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
