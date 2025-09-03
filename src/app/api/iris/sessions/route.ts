
'use server';

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getRemoteAgentById, createRemoteSession, logAuditEvent } from '@/lib/db';

/**
 * POST /api/iris/sessions
 * Initiates a new remote supervision session.
 */
export async function POST(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const operatorId = authResult.decodedToken.operatorId;

        const { agentId } = await request.json();

        if (!agentId) {
            return NextResponse.json({ error: 'agentId is required.' }, { status: 400 });
        }

        const agent = await getRemoteAgentById(agentId);
        if (!agent) {
            return NextResponse.json({ error: 'Agent not found.' }, { status: 404 });
        }
        
        // In a real system, we'd check if the agent is actually online.
        if (agent.status !== 'ONLINE') {
            return NextResponse.json({ error: 'Agent is currently offline.' }, { status: 409 });
        }

        const initialStatus = 'PENDING';
        const sessionId = await createRemoteSession(agentId, operatorId, initialStatus);

        await logAuditEvent('REMOTE_SESSION_REQUEST', operatorId, `Requested remote session ${sessionId} for agent ${agent.name} (${agentId})`);

        // Here, we would typically signal the agent to display a consent prompt.
        // Since we're simulating, we'll just return a pending status.
        // For testing, we can manually update the DB to 'ACTIVE'.
        console.log(`[REMOTE_SESSION] Session ${sessionId} created. In a real scenario, a consent prompt would be shown on the agent's machine.`);

        return NextResponse.json({
            message: 'Session request sent. Awaiting consent.',
            sessionId,
            status: initialStatus
        }, { status: 202 }); // 202 Accepted

    } catch (error: any) {
        console.error("[REMOTE_SESSION_POST_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Error creating remote session: ${error.message}`);
        return NextResponse.json({ error: 'Failed to initiate session.', details: error.message }, { status: 500 });
    }
}
