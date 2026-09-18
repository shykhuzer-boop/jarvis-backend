import { Pool } from 'pg';
import { env } from './env';

export const dbPool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const queryWithTenant = async (
  tenantId: string,
  text: string,
  params?: any[]
) => {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL app.current_tenant_id = $1`, [tenantId]);
    const res = await client.query(text, params);
    await client.query('COMMIT');
    return res;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};