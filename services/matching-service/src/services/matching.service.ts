import { matchingRepository } from '../repositories/matching.repository';
import { redisLocationRepository } from '../repositories/redis-location.repository';
import { driverClient } from '../clients/driver.client';
import { candidateFilterService } from './candidate-filter.service';
import { driverRankingService } from './driver-ranking.service';
import { assignmentService } from './assignment.service';
import { CreateMatchingDto } from '../dto/create-matching.dto';
import { MATCHING_STATUS } from '../utils/constants';
import { logger } from '../config/logger';
import { scheduleMatchingRetry } from '../jobs/producer';

export class MatchingService {
  async processMatching(data: CreateMatchingDto): Promise<void> {
    logger.info(`Processing matching for ride ${data.rideId}`);
    
    // Create matching record
    const matching = await matchingRepository.create(data.rideId);
    
    // Find nearby drivers in 10km radius
    const nearbyDrivers = await redisLocationRepository.findNearbyDrivers(data.pickupLon, data.pickupLat, 10);
    
    if (nearbyDrivers.length === 0) {
      logger.warn(`No nearby drivers found for ride ${data.rideId}`);
      await this.handleNoDriversFound(matching.id, data);
      return;
    }

    // Fetch details for filtering
    const driverDetailsPromises = nearbyDrivers.map(d => driverClient.getDriverDetails(d.driverId));
    const driverDetails = (await Promise.all(driverDetailsPromises)).filter(d => d !== null);

    // Filter available candidates
    const availableCandidates = candidateFilterService.filterAvailableDrivers(nearbyDrivers, driverDetails);
    
    if (availableCandidates.length === 0) {
      logger.warn(`No available drivers found after filtering for ride ${data.rideId}`);
      await this.handleNoDriversFound(matching.id, data);
      return;
    }

    // Add rating data from details to candidates before ranking
    availableCandidates.forEach(candidate => {
      const details = driverDetails.find(d => d.id === candidate.driverId);
      if (details && details.rating) {
        candidate.rating = details.rating;
      }
    });

    // Rank candidates
    const rankedCandidates = driverRankingService.rankDrivers(availableCandidates);
    const bestDriver = rankedCandidates[0];

    // Assign driver
    const assigned = await assignmentService.assignDriver(matching.id, data.rideId, bestDriver.driverId);
    
    if (!assigned) {
      await this.handleNoDriversFound(matching.id, data);
    }
  }

  private async handleNoDriversFound(matchingId: string, data: CreateMatchingDto) {
    await matchingRepository.updateStatusAndDriver(matchingId, MATCHING_STATUS.FAILED);
    await scheduleMatchingRetry(data);
  }
}

export const matchingService = new MatchingService();
