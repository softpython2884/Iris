
'use server';

import { NextResponse, NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getEntities } from '@/lib/db';

/**
 * GET /api/entities
 * Retrieves a list of all stored entities.
 * Supports searching via a query parameter `q`.
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticateRequest(request);
        if (authResult.error) {
          return NextResponse.json(
            {error: authResult.error},
            {status: authResult.status}
          );
        }
        
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('q');

        const entities = await getEntities(searchQuery);
        return NextResponse.json(entities);

    } catch (error: any) {
        console.error('[GET_ENTITIES_ERROR]', error);
        return NextResponse.json(
          {error: 'Failed to retrieve entities.', details: error.message},
          {status: 500}
        );
    }
}
