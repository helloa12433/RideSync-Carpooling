export const mapMatchingToDto = (matching: any) => {
  return {
    id: matching.id,
    rideId: matching.ride_id,
    status: matching.status,
    assignedDriverId: matching.assigned_driver_id,
    createdAt: matching.created_at,
    updatedAt: matching.updated_at,
  };
};
