
'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { authenticateRequest } from '@/lib/auth';
import { createChatChannel, getChannelByName, logAuditEvent } from '@/lib/db';

/**
 * POST /api/chat
 * Creates a new chat channel.
 */
export async function POST(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const operatorId = authResult.decodedToken.operatorId;

        const { name, is_persistent = false } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Channel name is required.' }, { status: 400 });
        }

        const existingChannel = await getChannelByName(name);
        if (existingChannel) {
            return NextResponse.json({ error: 'Channel name already exists.' }, { status: 409 });
        }
        
        const channelId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        await createChatChannel({
            id: channelId,
            name,
            is_persistent,
            created_at: timestamp,
        });

        await logAuditEvent('CHAT_CHANNEL_CREATED', operatorId, `Channel "${name}" created.`);

        return NextResponse.json({ message: 'Channel created successfully.', channelId }, { status: 201 });

    } catch (error: any) {
        console.error("[CHAT_CHANNEL_POST_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Error creating chat channel: ${error.message}`);
        return NextResponse.json({ error: 'Failed to create channel.', details: error.message }, { status: 500 });
    }
}
