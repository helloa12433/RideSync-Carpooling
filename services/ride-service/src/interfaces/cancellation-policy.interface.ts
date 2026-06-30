export interface ICancellationPolicy {
  id: string;
  min_hours: number;
  max_hours: number;
  refund_percentage: number;
  created_at: Date;
  updated_at: Date;
}
