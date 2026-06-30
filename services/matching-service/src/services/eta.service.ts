import { DriverCandidateDto } from '../dto/driver-candidate.dto';

export class EtaService {
  calculateEta(distanceKm: number): number {
    // Basic calculation: Assume average speed of 30 km/h in city
    // Time in minutes = (Distance / Speed) * 60
    const speedKmh = 30;
    const timeHours = distanceKm / speedKmh;
    return Math.round(timeHours * 60);
  }
}

export const etaService = new EtaService();
