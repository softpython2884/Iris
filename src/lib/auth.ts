'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getSystemState } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-env';

export async function authenticateRequest(request: Request) {
    // 1. Check lockdown status first
    const lockdownLevel = await getSystemState('lockdown_level');
    if (lockdownLevel === 'LV2' || lockdownLevel === 'LV3') {
        return { error: 'System is under lockdown. Access denied.', status: 503 };
    }

    // 2. Verify JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Authorization required.', status: 401 };
    }
    
    const token = authHeader.substring(7);
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return { error: 'Invalid or expired token.', status: 401 };
    }

    return { decodedToken };
}
