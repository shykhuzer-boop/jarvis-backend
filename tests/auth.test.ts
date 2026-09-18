import request from 'supertest';
import { app } from '../Src/app';

describe('Auth API Endpoints', () => {
  it('should return 422 on invalid registration payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: '123' });

    expect(res.statusCode).toEqual(422);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('should return 401 on unauthorized access to protected chat route', async () => {
    const res = await request(app)
      .post('/api/v1/chat/message')
      .send({ prompt: 'Hello Jarvis' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});