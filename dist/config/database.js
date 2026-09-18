"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryWithTenant = exports.dbPool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.dbPool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
});
const queryWithTenant = async (tenantId, text, params) => {
    const client = await exports.dbPool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`SET LOCAL app.current_tenant_id = $1`, [tenantId]);
        const res = await client.query(text, params);
        await client.query('COMMIT');
        return res;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
};
exports.queryWithTenant = queryWithTenant;
