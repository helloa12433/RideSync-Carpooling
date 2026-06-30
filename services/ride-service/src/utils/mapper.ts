import { IRide } from '../interfaces/ride.interface';
import { RideProfileDto } from '../dto/ride-profile.dto';

export const toRideProfileDto = (ride: IRide): RideProfileDto => {
  return {
    id: ride.id,
    driver_id: ride.driver_id,
    vehicle_id: ride.vehicle_id,
    source_location: ride.source_location,
    destination_location: ride.destination_location,
    distance: ride.distance,
    departure_time: ride.departure_time,
    estimated_arrival_time: ride.estimated_arrival_time,
    total_seats: ride.total_seats,
    available_seats: ride.available_seats,
    price_per_seat: ride.price_per_seat,
    status: ride.status,
    visibility: ride.visibility,
    created_at: ride.created_at,
    updated_at: ride.updated_at,
  };
};
