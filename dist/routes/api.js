"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const chatController_1 = require("../controllers/chatController");
const actionController_1 = require("../controllers/actionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Health Check Endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// Public Authentication Routes
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
// Protected Multi-Tenant Routes
router.post('/chat/message', authMiddleware_1.authenticateJwt, chatController_1.processMessage);
router.post('/actions/confirm', authMiddleware_1.authenticateJwt, actionController_1.confirmAction);
exports.default = router;
