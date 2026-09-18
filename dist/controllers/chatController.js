"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = void 0;
const chatService_1 = require("../services/chatService");
const errorHandler_1 = require("../middlewares/errorHandler");
const chatService = new chatService_1.ChatService();
const processMessage = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) {
            throw new errorHandler_1.AppError(400, 'VALIDATION_ERROR', 'Prompt text is required.');
        }
        const tenantId = req.user.tenantId;
        const userId = req.user.userId;
        const result = await chatService.processUserMessage(text, tenantId, userId);
        return res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
exports.processMessage = processMessage;
