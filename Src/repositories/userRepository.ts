import { dbPool } from '../config/database';

export class UserRepository {
  async findByEmail(email: string) {
    const res = await dbPool.query(
      `SELECT id, tenant_id, email, password_hash, role FROM users WHERE email = $1`,
      [email]
    );
    return res.rows[0] || null;
  }

  async createUser(tenantId: string, email: string, passwordHash: string, role: string) {
    const res = await dbPool.query(
      `INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, tenant_id, email, role`,
      [tenantId, email, passwordHash, role]
    );
    return res.rows[0];
  }

  async createTenant(name: string, planType: string = 'FREE') {
    const res = await dbPool.query(
      `INSERT INTO tenants (name, plan_type) VALUES ($1, $2) RETURNING id, name, plan_type`,
      [name, planType]
    );
    return res.rows[0];
  }
}