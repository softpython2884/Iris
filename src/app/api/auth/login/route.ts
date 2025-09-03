'use server';
import { NextResponse } from 'next/server';
import { db, getUserByKey, updateUserToken, getSystemState, logAuditEvent } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-env';
const JWT_EXPIRES_IN = '8h';

export async function POST(request: Request) {
  try {
    const lockdownLevel = await getSystemState('lockdown_level');
    if (lockdownLevel === 'LV2' || lockdownLevel === 'LV3') {
        await logAuditEvent('LOGIN_FAIL', null, 'Attempted login while system is under lockdown.');
        return NextResponse.json({ error: 'System is under lockdown. Access denied.' }, { status: 503 });
    }

    const { accessKey } = await request.json();

    if (!accessKey) {
        return NextResponse.json({ error: 'Access Key is required.' }, { status: 400 });
    }

    const user = await getUserByKey(accessKey);

    if (!user) {
        await logAuditEvent('LOGIN_FAIL', null, `Invalid access key used.`);
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
        { operatorId: user.operatorId, securityLevel: user.securityLevel },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Store token and expiration in DB
    const decoded = jwt.decode(token) as { exp: number };
    const tokenExpires = new Date(decoded.exp * 1000).toISOString();
    
    await updateUserToken(user.operatorId, token, tokenExpires);

    await logAuditEvent('LOGIN_SUCCESS', user.operatorId, `Operator successfully authenticated.`);

    return NextResponse.json({
        operatorId: user.operatorId,
        securityLevel: user.securityLevel,
        token: token
    });

  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error);
    await logAuditEvent('LOGIN_ERROR', null, `Internal server error during login process: ${error.message}`);
    return NextResponse.json({ error: 'Authentication process failed.', details: error.message }, { status: 500 });
  }
}
