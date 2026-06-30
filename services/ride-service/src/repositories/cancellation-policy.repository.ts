import { cassandraClient } from '../config/cassandra';
import { ICancellationPolicy } from '../interfaces/cancellation-policy.interface';

class CancellationPolicyRepository {
  public async getPolicies(): Promise<ICancellationPolicy[]> {
    const query = 'SELECT * FROM cancellation_policies';
    const result = await cassandraClient.execute(query, [], { prepare: true });
    
    return result.rows as unknown as ICancellationPolicy[];
  }
}

export const cancellationPolicyRepository = new CancellationPolicyRepository();
