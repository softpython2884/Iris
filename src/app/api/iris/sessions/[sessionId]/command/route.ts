
'use server';

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getRemoteSession, logRemoteCommand } from '@/lib/db';

interface RouteContext {
  params: {
    sessionId: string;
  };
}

/**
 * POST /api/iris/sessions/[sessionId]/command
 * Executes a command on a remote agent within an active session.
 */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const operatorId = authResult.decodedToken.operatorId;
    const { sessionId } = params;

    const session = await getRemoteSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }
    
    // Security check: Only the operator who started the session can send commands.
    if (session.operatorId !== operatorId) {
        return NextResponse.json({ error: 'You are not authorized to control this session.' }, { status: 403 });
    }
    
    // Ensure the session is active.
    if (session.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Session is not active. Consent may be pending or denied.' }, { status: 403 });
    }
    
    const { command } = await request.json();
    if (!command) {
        return NextResponse.json({ error: 'Command is required.' }, { status: 400 });
    }

    // --- Agent Communication Simulation ---
    // In a real system, you would send the command to the agent and wait for a response.
    // Here, we simulate this interaction.
    console.log(`[REMOTE_CMD_EXEC] Simulating command "${command}" for session ${sessionId}`);
    const { output, isError } = await simulateCommandExecution(command);
    // --- End Simulation ---
    
    // Log the command and its output for audit purposes.
    await logRemoteCommand(sessionId, command, output, isError);

    return NextResponse.json({ output, isError });

  } catch (error: any) {
    console.error(`[REMOTE_COMMAND_ERROR] sessionId=${params.sessionId}`, error);
    return NextResponse.json({ error: 'Failed to execute remote command.', details: error.message }, { status: 500 });
  }
}


/**
 * Simulates running a shell command.
 * In a real implementation, this would be a network call to the agent.
 */
async function simulateCommandExecution(command: string): Promise<{ output: string; isError: boolean; }> {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'whoami') {
        return { output: 'agent_user', isError: false };
    }
    if (cmd === 'ls -la') {
        return { output: `total 8\ndrwxr-xr-x 2 agent_user agent_group 4096 Aug 29 18:00 .\ndrwxr-xr-x 5 agent_user agent_group 4096 Aug 29 17:00 ..\n-rw-r--r-- 1 agent_user agent_group    0 Aug 29 18:00 secret_data.txt`, isError: false };
    }
    if (cmd.startsWith('cat')) {
        return { output: `Error: permission denied for file: ${cmd.split(' ')[1]}`, isError: true };
    }
     if (cmd === 'ps aux') {
        return { output: `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot           1  0.0  0.1  12345  6789 ?        Ss   Aug29   0:01 /sbin/init\nagent_user  1337  0.5  0.2  65432  9876 ?        S    18:00   0:05 /usr/bin/iris-agent-v2`, isError: false };
    }

    return { output: `Command not recognized by simulation: ${command}`, isError: true };
}
