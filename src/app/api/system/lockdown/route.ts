'use server';

import { NextResponse } from 'next/server';
import { getSystemState, setSystemState, logAuditEvent } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

/**
 * GET /api/system/lockdown
 * Retrieves the current system lockdown level.
 */
export async function GET(request: Request) {
    try {
        const lockdownLevel = await getSystemState('lockdown_level');
        return NextResponse.json({ lockdownLevel: lockdownLevel || 'NONE' });
    } catch (error: any) {
        console.error("[LOCKDOWN_GET_ERROR]", error);
        return NextResponse.json({ error: 'Failed to retrieve system state.', details: error.message }, { status: 500 });
    }
}


/**
 * POST /api/system/lockdown
 * Sets the system lockdown level. Requires admin privileges.
 */
export async function POST(request: Request) {
  try {
    // 1. Authenticate and authorize the request
    const authData = await authenticateRequest(request);
    if ('error' in authData) {
        return NextResponse.json({ error: authData.error }, { status: authData.status });
    }
    if (authData.decodedToken.securityLevel !== '7') {
        return NextResponse.json({ error: 'Insufficient permissions. Administrator access required.' }, { status: 403 });
    }

    // 2. Process the request
    const { level } = await request.json();
    const validLevels = ['NONE', 'LV1', 'LV2', 'LV3'];
    if (!level || !validLevels.includes(level)) {
        return NextResponse.json({ error: 'Invalid lockdown level provided.' }, { status: 400 });
    }

    // 3. Update the system state and log the event
    await setSystemState('lockdown_level', level);
    await logAuditEvent('LOCKDOWN_CHANGE', authData.decodedToken.operatorId, `System lockdown level changed to ${level}`);
    
    // In a real scenario, you would trigger other actions here,
    // like invalidating all user sessions for LV2/LV3.
    // For now, our auth middleware handles blocking access on LV2/LV3.

    return NextResponse.json({ message: `System lockdown level set to ${level}` });

  } catch (error: any) {
    console.error("[LOCKDOWN_POST_ERROR]", error);
    await logAuditEvent('LOCKDOWN_ERROR', 'SYSTEM', `Failed to set lockdown state: ${error.message}`);
    return NextResponse.json({ error: 'Failed to set lockdown state.', details: error.message }, { status: 500 });
  }
}
