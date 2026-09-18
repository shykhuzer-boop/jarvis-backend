import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ChatService } from '../services/chatService';
import { AppError } from '../middlewares/errorHandler';

const chatService = new ChatService();

export const processMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text } = req.body;
    if (!text) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Prompt text is required.');
    }

    const tenantId = req.user!.tenantId;
    const userId = req.user!.userId;

    const result = await chatService.processUserMessage(text, tenantId, userId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};