
'use server';

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getJob, getJobLogs, getJobUrls } from '@/lib/db';

interface RouteContext {
    params: {
        jobId: string;
    };
}

/**
 * GET /api/bots/jobs/[jobId]
 * Retrieves the full details for a specific bot job, including its URLs and logs.
 */
export async function GET(request: Request, { params }: RouteContext) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }
        
        const { jobId } = params;
        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
        }

        const job = await getJob(jobId);
        if (!job) {
            return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
        }

        const urls = await getJobUrls(jobId);
        const logs = await getJobLogs(jobId);

        return NextResponse.json({
            ...job,
            queue: urls,
            logs: logs,
        });

    } catch (error: any) {
        console.error(`[BOT_JOB_GET_ERROR] jobId=${params.jobId}`, error);
        return NextResponse.json({ error: 'Failed to retrieve job details.', details: error.message }, { status: 500 });
    }
}
