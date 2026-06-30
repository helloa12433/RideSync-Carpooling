export class EtaService {
  calculateEta(driverLat: number, driverLon: number, targetLat: number, targetLon: number): { etaMinutes: number, distanceKm: number } {
    // Simplified Haversine formula for distance
    const R = 6371; // km
    const dLat = (targetLat - driverLat) * Math.PI / 180;
    const dLon = (targetLon - driverLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(driverLat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;

    // Average city speed 30km/h
    const etaMinutes = Math.round((distanceKm / 30) * 60);

    return { etaMinutes, distanceKm };
  }
}

export const etaService = new EtaService();
