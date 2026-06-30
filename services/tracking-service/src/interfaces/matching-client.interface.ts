export interface IMatchingClient {
  getMatchingDetails(matchingId: string): Promise<any>;
}
