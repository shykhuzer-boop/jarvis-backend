"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAction = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const confirmAction = async (req, res, next) => {
    try {
        const { actionId, decision } = req.body;
        if (!actionId || !['APPROVE', 'REJECT'].includes(decision)) {
            throw new errorHandler_1.AppError(400, 'VALIDATION_ERROR', 'Action ID and valid decision (APPROVE/REJECT) required.');
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
    }
    catch (err) {
        next(err);
    }
};
exports.confirmAction = confirmAction;
