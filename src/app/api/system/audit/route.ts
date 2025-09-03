
'use server';

import { NextResponse } from 'next/server';
import { getAuditLog } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

/**
 * GET /api/system/audit
 * Retrieves the full system audit log. Requires admin privileges.
 */
export async function GET(request: Request) {
  try {
    const authData = await authenticateRequest(request);
    if ('error' in authData) {
        return NextResponse.json({ error: authData.error }, { status: authData.status });
    }
    // Ensure only admins can access the full audit log
    if (authData.decodedToken.securityLevel !== '7') {
        return NextResponse.json({ error: 'Insufficient permissions. Administrator access required.' }, { status: 403 });
    }

    const auditLog = await getAuditLog();
    return NextResponse.json(auditLog);

  } catch (error: any) {
    console.error("[AUDIT_LOG_GET_ERROR]", error);
    // Do not log an audit event for a failure to get the audit log itself, to prevent loops.
    return NextResponse.json({ error: 'Failed to retrieve audit log.', details: error.message }, { status: 500 });
  }
}
