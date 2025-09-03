
'use server';

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getEntities } from '@/lib/db';

/**
 * GET /api/entities
 * Retrieves a list of all stored entities.
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

        const entities = await getEntities();
        return NextResponse.json(entities);

    } catch (error: any) {
        console.error('[GET_ENTITIES_ERROR]', error);
        return NextResponse.json(
          {error: 'Failed to retrieve entities.', details: error.message},
          {status: 500}
        );
    }
}
