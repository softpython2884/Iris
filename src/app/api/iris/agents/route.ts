
'use server';
import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { createRemoteAgent, getRemoteAgents, logAuditEvent } from '@/lib/db';

/**
 * GET /api/iris/agents
 * Retrieves a list of all registered remote agents.
 */
export async function GET(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        
        const agents = await getRemoteAgents();
        return NextResponse.json(agents);

    } catch (error: any) {
        console.error("[AGENTS_GET_ERROR]", error);
        return NextResponse.json({ error: 'Failed to retrieve remote agents.', details: error.message }, { status: 500 });
    }
}

/**
 * POST /api/iris/agents
 * Registers a new remote agent. This simulates an agent coming online.
 */
export async function POST(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        const operatorId = authResult.decodedToken.operatorId;

        const { name, ipAddress } = await request.json();

        if (!name || !ipAddress) {
            return NextResponse.json({ error: 'Agent name and IP address are required.' }, { status: 400 });
        }
        
        const agentId = await createRemoteAgent(name, ipAddress);

        await logAuditEvent('AGENT_REGISTERED', operatorId, `New remote agent registered: ${name} (${agentId})`);

        return NextResponse.json({ message: 'Agent registered successfully', agentId }, { status: 201 });

    } catch (error: any) {
        console.error("[AGENTS_POST_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Error registering agent: ${error.message}`);
        return NextResponse.json({ error: 'Failed to register agent.', details: error.message }, { status: 500 });
    }
}
