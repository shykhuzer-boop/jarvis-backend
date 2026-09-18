"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    async processUserMessage(promptText, tenantId, userId) {
        const lowercasePrompt = promptText.toLowerCase();
        // Detect Mutating Action Intent
        if (lowercasePrompt.includes('email') ||
            lowercasePrompt.includes('schedule') ||
            lowercasePrompt.includes('meeting')) {
            const actionId = `act_${Date.now()}`;
            const toolType = lowercasePrompt.includes('email') ? 'EMAIL_DISPATCH' : 'CALENDAR_CREATE';
            return {
                messageId: `msg_${Date.now()}`,
                replyText: `I have prepared that request for you. Please confirm the action below before I dispatch it.`,
                pendingAction: {
                    actionId,
                    tool: toolType,
                    payload: {
                        summary: promptText,
                        target: 'Primary Contacts / Calendar',
                    },
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                },
            };
        }
        // Standard Conversational Query Response
        return {
            messageId: `msg_${Date.now()}`,
            replyText: `Jarvis Assistant Response: I have received your query "${promptText}". How else can I assist you today?`,
            pendingAction: null,
        };
    }
}
exports.ChatService = ChatService;
