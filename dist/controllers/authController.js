"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const zod_1 = require("zod");
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middlewares/errorHandler");
const authService = new authService_1.AuthService();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    fullName: zod_1.z.string().min(2),
    tenantName: zod_1.z.string().min(2),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = async (req, res, next) => {
    try {
        const validated = registerSchema.parse(req.body);
        const result = await authService.registerUser(validated.email, validated.password, validated.fullName, validated.tenantName);
        return res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return next(new errorHandler_1.AppError(400, 'VALIDATION_ERROR', 'Invalid payload', err.errors));
        }
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const validated = loginSchema.parse(req.body);
        const result = await authService.loginUser(validated.email, validated.password);
        return res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return next(new errorHandler_1.AppError(400, 'VALIDATION_ERROR', 'Invalid payload', err.errors));
        }
        next(err);
    }
};
exports.login = login;
