import { env } from './env';
import { logger } from './logger';

export const getRouteData = async (startLng: number, startLat: number, endLng: number, endLat: number) => {
  try {
    // Note: Mapbox SDK can be used here, or a direct HTTP request to Mapbox Directions API
    // We mock the call logic here to just use the token in headers if using fetch/axios
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${env.MAPBOX_ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    return {
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
    };
  } catch (error) {
    logger.error('Mapbox API error', { error });
    throw error;
  }
};
