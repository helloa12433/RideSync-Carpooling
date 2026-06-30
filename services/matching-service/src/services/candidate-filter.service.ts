import { DriverCandidateDto } from '../dto/driver-candidate.dto';

export class CandidateFilterService {
  filterAvailableDrivers(candidates: DriverCandidateDto[], driverDetails: any[]): DriverCandidateDto[] {
    return candidates.filter((candidate) => {
      const details = driverDetails.find((d) => d.id === candidate.driverId);
      if (!details) return false;
      
      // Basic filter: driver must be online/available
      return details.status === 'AVAILABLE';
    });
  }
}

export const candidateFilterService = new CandidateFilterService();
