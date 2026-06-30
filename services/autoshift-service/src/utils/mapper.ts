export const mapAutoshiftToDto = (data: any) => {
  return {
    id: data.id,
    rideId: data.ride_id,
    oldDriverId: data.old_driver_id,
    newDriverId: data.new_driver_id,
    reason: data.reason,
    type: data.type,
    status: data.status,
    createdAt: data.created_at,
    completedAt: data.completed_at,
  };
};
