import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../middlewares/errorHandler';

export class AuthService {
  private userRepo = new UserRepository();

  async registerUser(email: string, password: string, fullName: string, tenantName: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'USER_EXISTS', 'A user with this email address already exists.');
    }

    const tenant = await this.userRepo.createTenant(tenantName, 'FREE');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepo.createUser(tenant.id, email, passwordHash, 'OWNER');

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role,
        fullName,
      },
    };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role,
      },
    };
  }
}