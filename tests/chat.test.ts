import request from 'supertest';
import { app } from '../Src/app';

describe('Health Check & System API', () => {
  it('GET /api/v1/health should return system status OK', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});