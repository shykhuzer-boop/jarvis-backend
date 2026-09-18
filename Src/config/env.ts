import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://jarvis_user:jarvis_pass@localhost:5432/jarvis_db'),
  JWT_SECRET: z.string().default('default_jwt_secret_change_me_in_prod'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);