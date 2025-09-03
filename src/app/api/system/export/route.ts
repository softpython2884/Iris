
'use server';

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db, logAuditEvent } from '@/lib/db';

/**
 * POST /api/system/export
 * Generates a full export of the system's data.
 * Requires admin privileges (Security Level 7).
 */
export async function POST(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        
        if (authResult.decodedToken.securityLevel !== '7') {
            return NextResponse.json({ error: 'Insufficient permissions. Administrator access required.' }, { status: 403 });
        }
        const operatorId = authResult.decodedToken.operatorId;

        await logAuditEvent('DATA_EXPORT_INITIATED', operatorId, 'Full data export procedure initiated.');

        // Fetch data from all critical tables
        const users = await db.all('SELECT operatorId, securityLevel, accessKey FROM users');
        const audit_log = await db.all('SELECT * FROM audit_log');
        const entities = await db.all('SELECT * FROM entities');
        const mailbox = await db.all('SELECT * FROM mailbox');
        const chat_channels = await db.all('SELECT * FROM chat_channels');
        const chat_messages = await db.all('SELECT * FROM chat_messages');
        const bot_jobs = await db.all('SELECT * FROM bot_jobs');
        const bot_job_urls = await db.all('SELECT * FROM bot_job_urls');
        const bot_job_logs = await db.all('SELECT * FROM bot_job_logs');
        const remote_agents = await db.all('SELECT * FROM remote_agents');
        const remote_sessions = await db.all('SELECT * FROM remote_sessions');
        const remote_commands = await db.all('SELECT * FROM remote_commands');
        const system_state = await db.all('SELECT * FROM system_state');
        

        const exportData = {
            export_timestamp: new Date().toISOString(),
            schema_version: '1.0',
            data: {
                users,
                audit_log,
                entities,
                mailbox,
                chat_channels,
                chat_messages,
                bot_jobs,
                bot_job_urls,
                bot_job_logs,
                remote_agents,
                remote_sessions,
                remote_commands,
                system_state,
            }
        };

        await logAuditEvent('DATA_EXPORT_COMPLETED', operatorId, 'Full data export procedure completed successfully.');

        return NextResponse.json(exportData);

    } catch (error: any) {
        console.error("[DATA_EXPORT_ERROR]", error);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Critical error during data export: ${error.message}`);
        return NextResponse.json({ error: 'Failed to generate data export.', details: error.message }, { status: 500 });
    }
}
