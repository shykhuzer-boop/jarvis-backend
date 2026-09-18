import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AppError } from '../middlewares/errorHandler';

export const confirmAction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { actionId, decision } = req.body;
    if (!actionId || !['APPROVE', 'REJECT'].includes(decision)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Action ID and valid decision (APPROVE/REJECT) required.');
    }

    if (decision === 'REJECT') {
      return res.status(200).json({
        success: true,
        data: { actionId, status: 'REJECTED', message: 'Action cancelled by user.' },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        actionId,
        status: 'EXECUTED',
        result: { confirmation: 'Task successfully dispatched to native system integration.' },
      },
    });
  } catch (err) {
    next(err);
  }
};