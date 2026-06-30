import { DriverCandidateDto } from '../dto/driver-candidate.dto';
import { etaService } from './eta.service';

export class DriverRankingService {
  rankDrivers(candidates: DriverCandidateDto[]): DriverCandidateDto[] {
    return candidates
      .map((candidate) => {
        // Calculate ETA
        candidate.eta = etaService.calculateEta(candidate.distance);
        
        // Simple scoring based on distance, ETA, and rating (if available)
        // Lower score is better
        let score = candidate.distance * 10 + candidate.eta * 2;
        
        if (candidate.rating) {
          // Bonus for higher rating (e.g. subtract score points)
          score -= candidate.rating * 5;
        }

        candidate.score = score;
        return candidate;
      })
      .sort((a, b) => (a.score || 0) - (b.score || 0));
  }
}

export const driverRankingService = new DriverRankingService();
