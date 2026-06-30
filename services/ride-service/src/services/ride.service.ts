import { rideRepository } from '../repositories/ride.repository';
import { cancellationPolicyRepository } from '../repositories/cancellation-policy.repository';
import { CreateRideDto } from '../dto/create-ride.dto';
import { UpdateRideDto } from '../dto/update-ride.dto';
import { CancelRideDto } from '../dto/cancel-ride.dto';
import { IRide } from '../interfaces/ride.interface';
import { redisClient } from '../config/redis';
import { getRouteData } from '../config/mapbox';
import { publishEvent } from '../events/producer';
import { publishJob } from '../jobs/producer';
import { KAFKA_TOPICS, RABBITMQ_QUEUES, RIDE_STATUS } from '../utils/constants';

class RideService {
  public async createRide(data: CreateRideDto): Promise<IRide> {
    const { distance, duration } = await getRouteData(
      data.source_lng, data.source_lat, data.destination_lng, data.destination_lat
    );

    // Calculate ETA based on duration returned by Mapbox
    const estimated_arrival_time = new Date(new Date(data.departure_time).getTime() + duration * 1000);

    const ride = await rideRepository.create({
      ...data,
      distance,
      estimated_arrival_time,
    });

    await publishEvent(KAFKA_TOPICS.RIDE_CREATED, ride);

    return ride;
  }

  public async getRide(id: string): Promise<IRide | null> {
    const cacheKey = `ride:${id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) return JSON.parse(cached) as IRide;

    const ride = await rideRepository.findById(id);

    if (ride) {
      await redisClient.setex(cacheKey, 600, JSON.stringify(ride)); // Cache for 10 minutes
    }

    return ride;
  }

  public async getDriverRides(driverId: string) {
    return rideRepository.findByDriverId(driverId);
  }

  public async searchRides(source: string, destination: string) {
    return rideRepository.searchRides(source, destination);
  }

  public async publishRide(id: string): Promise<IRide | null> {
    const updatedRide = await rideRepository.updateRideStatus(id, RIDE_STATUS.PUBLISHED);
    
    if (updatedRide) {
      await redisClient.del(`ride:${id}`);
      await publishEvent(KAFKA_TOPICS.RIDE_STATUS_UPDATED, { ride_id: id, status: RIDE_STATUS.PUBLISHED });
    }

    return updatedRide;
  }

  public async updateRide(id: string, data: UpdateRideDto): Promise<IRide | null> {
    const updatedRide = await rideRepository.update(id, data);

    if (updatedRide) {
      await redisClient.del(`ride:${id}`);
      await publishEvent(KAFKA_TOPICS.RIDE_UPDATED, updatedRide);
    }

    return updatedRide;
  }

  public async cancelRide(data: CancelRideDto): Promise<IRide | null> {
    const ride = await rideRepository.findById(data.ride_id);
    if (!ride) throw new Error('Ride not found');
    
    if ([RIDE_STATUS.STARTED, RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED].includes(ride.status)) {
      throw new Error(`Cannot cancel ride in status: ${ride.status}`);
    }

    const updatedRide = await rideRepository.updateRideStatus(data.ride_id, RIDE_STATUS.CANCELLED);
    
    if (updatedRide) {
      await redisClient.del(`ride:${data.ride_id}`);
      await publishEvent(KAFKA_TOPICS.RIDE_CANCELLED, { ride_id: data.ride_id, reason: data.reason });

      // Calculate refund asynchronously via queue
      await publishJob(RABBITMQ_QUEUES.REFUND_QUEUE, {
        ride_id: data.ride_id,
        reason: data.reason,
        cancelled_at: new Date(),
        departure_time: ride.departure_time,
      });
    }

    return updatedRide;
  }

  public async calculateRefund(ride_id: string, cancelled_at: Date, departure_time: Date): Promise<number> {
    // Determine hours before departure
    const diffMs = departure_time.getTime() - cancelled_at.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const cacheKey = 'cancellation_policies';
    let policies = await redisClient.get(cacheKey).then(res => res ? JSON.parse(res) : null);

    if (!policies) {
      policies = await cancellationPolicyRepository.getPolicies();
      await redisClient.setex(cacheKey, 3600, JSON.stringify(policies));
    }

    if (!policies || policies.length === 0) {
      // Default fallback if no policies are defined
      return diffHours >= 24 ? 100 : 0;
    }

    // Find applicable policy
    const policy = policies.find((p: any) => diffHours >= p.min_hours && diffHours < p.max_hours);
    
    // Default to lowest bracket or 0 if started/negative
    return policy ? policy.refund_percentage : 0;
  }

  public async startRide(id: string): Promise<IRide | null> {
    const updatedRide = await rideRepository.updateRideStatus(id, RIDE_STATUS.STARTED);
    if (updatedRide) {
      await redisClient.del(`ride:${id}`);
      await publishEvent(KAFKA_TOPICS.RIDE_STARTED, { ride_id: id });
    }
    return updatedRide;
  }

  public async completeRide(id: string): Promise<IRide | null> {
    const updatedRide = await rideRepository.updateRideStatus(id, RIDE_STATUS.COMPLETED);
    if (updatedRide) {
      await redisClient.del(`ride:${id}`);
      await publishEvent(KAFKA_TOPICS.RIDE_COMPLETED, { ride_id: id });
    }
    return updatedRide;
  }
}

export const rideService = new RideService();
