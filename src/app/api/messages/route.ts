'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { authenticateRequest } from '@/lib/auth';
import { storeMessage, getMessagesForRecipient, logAuditEvent } from '@/lib/db';

/**
 * POST /api/messages
 * Sends a new encrypted message.
 */
export async function POST(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const senderId = authResult.decodedToken.operatorId;

        const { recipientId, encryptedContent, signature, prevMessageId, conversationId: existingConvId } = await request.json();

        if (!recipientId || !encryptedContent || !signature) {
            return NextResponse.json({ error: 'recipientId, encryptedContent, and signature are required.' }, { status: 400 });
        }
        
        // A new message starts a new conversation unless a conversationId is provided (for replies/updates)
        const conversationId = existingConvId || crypto.randomUUID();
        const messageId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        await storeMessage({
            id: messageId,
            conversationId,
            senderId,
            recipientId,
            encryptedContent,
            signature,
            timestamp,
            prevMessageId: prevMessageId || null,
        });

        await logAuditEvent('MESSAGE_SENT', senderId, `Message sent to ${recipientId} in conversation ${conversationId}`);

        return NextResponse.json({ message: 'Message sent successfully.', messageId, conversationId }, { status: 201 });

    } catch (error: any) {
        console.error("[MESSAGE_POST_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Error sending message: ${error.message}`);
        return NextResponse.json({ error: 'Failed to send message.', details: error.message }, { status: 500 });
    }
}

/**
 * GET /api/messages
 * Retrieves all messages for the authenticated user.
 */
export async function GET(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const recipientId = authResult.decodedToken.operatorId;

        const messages = await getMessagesForRecipient(recipientId);

        await logAuditEvent('MESSAGES_FETCHED', recipientId, `User fetched ${messages.length} messages.`);

        return NextResponse.json({ messages });

    } catch (error: any) {
        console.error("[MESSAGE_GET_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Error fetching messages: ${error.message}`);
        return NextResponse.json({ error: 'Failed to retrieve messages.', details: error.message }, { status: 500 });
    }
}
