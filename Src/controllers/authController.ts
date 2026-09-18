import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { AppError } from '../middlewares/errorHandler';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  tenantName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.registerUser(
      validated.email,
      validated.password,
      validated.fullName,
      validated.tenantName
    );
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid payload', err.errors));
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.loginUser(validated.email, validated.password);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid payload', err.errors));
    }
    next(err);
  }
};