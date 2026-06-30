export interface IDriverClient {
  getDriverDetails(driverId: string): Promise<any>;
}
