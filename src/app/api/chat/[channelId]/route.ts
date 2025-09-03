
'use server';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { authenticateRequest } from '@/lib/auth';
import { storeChatMessage, getMessagesForChannel } from '@/lib/db';

interface RouteContext {
  params: {
    channelId: string;
  };
}

/**
 * GET /api/chat/[channelId]
 * Retrieves messages from a specific channel. Supports polling with a 'since' timestamp.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { channelId } = params;
        const { searchParams } = new URL(request.url);
        const since = searchParams.get('since') || undefined;

        const messages = await getMessagesForChannel(channelId, since);

        return NextResponse.json({ messages });

    } catch (error: any) {
        console.error(`[CHAT_GET_ERROR] channelId=${params.channelId}`, error);
        // Do not log audit for simple GET errors to avoid log flooding
        return NextResponse.json({ error: 'Failed to retrieve chat messages.', details: error.message }, { status: 500 });
    }
}

/**
 * POST /api/chat/[channelId]
 * Sends a message to a specific chat channel.
 */
export async function POST(request: Request, { params }: RouteContext) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const senderId = authResult.decodedToken.operatorId;
        const { channelId } = params;
        
        const { encryptedContent } = await request.json();
        if (!encryptedContent) {
            return NextResponse.json({ error: 'encryptedContent is required.' }, { status: 400 });
        }
        
        const messageId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        await storeChatMessage({
            id: messageId,
            channel_id: channelId,
            sender_id: senderId,
            encrypted_content: encryptedContent,
            timestamp,
        });

        // We don't log every chat message to audit to avoid flooding,
        // unless specific monitoring is required. This can be changed.

        return NextResponse.json({ message: 'Message sent.', messageId }, { status: 201 });

    } catch (error: any) {
        console.error(`[CHAT_POST_ERROR] channelId=${params.channelId}`, error);
        return NextResponse.json({ error: 'Failed to send message.', details: error.message }, { status: 500 });
    }
}
