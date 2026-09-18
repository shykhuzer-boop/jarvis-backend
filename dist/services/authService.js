"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const userRepository_1 = require("../repositories/userRepository");
const errorHandler_1 = require("../middlewares/errorHandler");
class AuthService {
    userRepo = new userRepository_1.UserRepository();
    async registerUser(email, password, fullName, tenantName) {
        const existing = await this.userRepo.findByEmail(email);
        if (existing) {
            throw new errorHandler_1.AppError(409, 'USER_EXISTS', 'A user with this email address already exists.');
        }
        const tenant = await this.userRepo.createTenant(tenantName, 'FREE');
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await this.userRepo.createUser(tenant.id, email, passwordHash, 'OWNER');
        const token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: user.tenant_id, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: '15m' });
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
    async loginUser(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new errorHandler_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            throw new errorHandler_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: user.tenant_id, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: '15m' });
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
exports.AuthService = AuthService;
