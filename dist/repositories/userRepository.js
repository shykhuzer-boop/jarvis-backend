"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
class UserRepository {
    async findByEmail(email) {
        const res = await database_1.dbPool.query(`SELECT id, tenant_id, email, password_hash, role FROM users WHERE email = $1`, [email]);
        return res.rows[0] || null;
    }
    async createUser(tenantId, email, passwordHash, role) {
        const res = await database_1.dbPool.query(`INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, tenant_id, email, role`, [tenantId, email, passwordHash, role]);
        return res.rows[0];
    }
    async createTenant(name, planType = 'FREE') {
        const res = await database_1.dbPool.query(`INSERT INTO tenants (name, plan_type) VALUES ($1, $2) RETURNING id, name, plan_type`, [name, planType]);
        return res.rows[0];
    }
}
exports.UserRepository = UserRepository;
