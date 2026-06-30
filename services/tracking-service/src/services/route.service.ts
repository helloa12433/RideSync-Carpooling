import { redisLocationRepository } from '../repositories/redis-location.repository';

export class RouteService {
  async getTripRoute(rideId: string): Promise<string> {
    const routeData = await redisLocationRepository.getRoute(rideId);
    // Serialize route array into a string representation or encode to polyline
    return JSON.stringify(routeData);
  }

  async calculateTotalDistance(rideId: string): Promise<number> {
    const route = await redisLocationRepository.getRoute(rideId);
    if (route.length < 2) return 0;
    
    // Simplistic sum of distances between points
    let totalDistance = 0;
    // Calculation omitted for simplicity, return mock
    return 12.5; 
  }
}

export const routeService = new RouteService();
