import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXZhZWxsYWxsYWwiLCJhIjoiY204b2U5Nzg0MDFzbDJtcHAxdGN5MWl4NSJ9.H9WERlS25nf9tn-fzf_Fsw';
mapboxgl.accessToken = MAPBOX_TOKEN;

export interface Location {
  name: string;
  lng: number;
  lat: number;
}

export function useMapboxRoute(
  mapContainer: MutableRefObject<HTMLDivElement | null>,
  map: MutableRefObject<mapboxgl.Map | null>,
  source: Location | null,
  destination: Location | null
) {
  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.006, 40.7128], // Default to NY
      zoom: 9,
      pitch: 45,
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Force resize to fix blank canvas if container mounts with zero dimensions
    setTimeout(() => {
      if (map.current) map.current.resize();
    }, 100);
    setTimeout(() => {
      if (map.current) map.current.resize();
    }, 500);
  }, [map, mapContainer]);

  // Update map when source/dest change
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    // Remove existing markers & routes
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    if (m.getSource('route')) {
      m.removeLayer('route');
      m.removeSource('route');
    }

    if (source && !destination) {
      new mapboxgl.Marker({ color: '#2563EB' }).setLngLat([source.lng, source.lat]).addTo(m);
      m.flyTo({ center: [source.lng, source.lat], zoom: 12 });
    } else if (!source && destination) {
      new mapboxgl.Marker({ color: '#16A34A' }).setLngLat([destination.lng, destination.lat]).addTo(m);
      m.flyTo({ center: [destination.lng, destination.lat], zoom: 12 });
    } else if (source && destination) {
      new mapboxgl.Marker({ color: '#2563EB' }).setLngLat([source.lng, source.lat]).addTo(m);
      new mapboxgl.Marker({ color: '#16A34A' }).setLngLat([destination.lng, destination.lat]).addTo(m);

      // Fetch Directions
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0].geometry;
            m.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            });
            m.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3B82F6',
                'line-width': 6,
                'line-opacity': 0.8
              }
            });

            // Fit bounds
            const bounds = new mapboxgl.LngLatBounds([source.lng, source.lat], [source.lng, source.lat]);
            bounds.extend([destination.lng, destination.lat]);
            m.fitBounds(bounds, { padding: 80, duration: 1500 });
          }
        });
    }
  }, [source, destination, map]);
}
