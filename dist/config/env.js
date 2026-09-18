"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().default('postgresql://jarvis_user:jarvis_pass@localhost:5432/jarvis_db'),
    JWT_SECRET: zod_1.z.string().default('default_jwt_secret_change_me_in_prod'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
});
exports.env = envSchema.parse(process.env);
