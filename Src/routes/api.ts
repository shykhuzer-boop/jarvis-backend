import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { processMessage } from '../controllers/chatController';
import { confirmAction } from '../controllers/actionController';
import { authenticateJwt } from '../middlewares/authMiddleware';

const router = Router();

// Health Check Endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Public Authentication Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected Multi-Tenant Routes
router.post('/chat/message', authenticateJwt, processMessage);
router.post('/actions/confirm', authenticateJwt, confirmAction);

export default router;