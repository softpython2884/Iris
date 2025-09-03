'use server';

import {NextResponse} from 'next/server';
import {authenticateRequest} from '@/lib/auth';
import {logAuditEvent, createBotJob, addUrlToQueue, getJobs} from '@/lib/db';
import { runJob } from '@/lib/services/job-service';

/**
 * GET /api/bots/jobs
 * Retrieves a list of all bot jobs.
 */
export async function GET(request: Request) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
          return NextResponse.json(
            {error: authResult.error},
            {status: authResult.status}
          );
        }

        const jobs = await getJobs();
        return NextResponse.json(jobs);

    } catch (error: any) {
        console.error('[BOT_JOBS_GET_ERROR]', error);
        // Avoid logging audit for GET to prevent log flooding
        return NextResponse.json(
          {error: 'Failed to retrieve bot jobs.', details: error.message},
          {status: 500}
        );
    }
}


/**
 * POST /api/bots/jobs
 * Initiates a new bot job to scrape and analyze a target URL.
 * This now runs asynchronously.
 */
export async function POST(request: Request) {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json(
        {error: authResult.error},
        {status: authResult.status}
      );
    }
    const operatorId = authResult.decodedToken.operatorId;

    const {targetUrl, cookies} = await request.json();

    if (!targetUrl) {
      return NextResponse.json(
        {error: 'targetUrl is required.'},
        {status: 400}
      );
    }
    
    // 1. Create the job entry in the database
    const jobId = await createBotJob(operatorId, targetUrl);
    await addUrlToQueue(jobId, targetUrl, 0);
    
    await logAuditEvent(
      'BOT_JOB_CREATED',
      operatorId,
      `Job ${jobId} created for target: ${targetUrl}`
    );

    // 2. Trigger the job to run in the background (fire-and-forget)
    // We don't `await` this, so the response is sent immediately.
    runJob(jobId, { cookies, maxDepth: 2, maxLinks: 10 }).catch(async (err) => {
        console.error(`[JOB_EXEC_ERROR] Unhandled error in job ${jobId}:`, err);
        await logAuditEvent('API_ERROR', 'SYSTEM', `Critical failure in background job ${jobId}: ${err.message}`);
    });

    // 3. Return the job ID to the client for tracking
    return NextResponse.json({
        message: 'Job successfully initiated. You can track its progress using the job ID.',
        jobId: jobId
    }, { status: 202 }); // 202 Accepted indicates async processing

  } catch (error: any) {
    console.error('[BOT_JOB_POST_ERROR]', error);
    await logAuditEvent(
      'API_ERROR',
      'SYSTEM',
      `Error during bot job creation: ${error.message}`
    );
    return NextResponse.json(
      {error: 'Failed to create bot job.', details: error.message},
      {status: 500}
    );
  }
}
