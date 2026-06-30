export const mapTrackingDataToDto = (data: any) => {
  return {
    rideId: data.ride_id,
    driverId: data.driver_id,
    lat: data.lat,
    lon: data.lon,
    timestamp: data.timestamp,
  };
};

export const mapTripHistoryToDto = (data: any) => {
  return {
    id: data.id,
    rideId: data.ride_id,
    route: data.route,
    distanceKm: data.distance_km,
    status: data.status,
    startedAt: data.started_at,
    completedAt: data.completed_at,
  };
};
