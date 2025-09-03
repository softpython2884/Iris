'use server';
import { NextResponse } from 'next/server';
import { db, getUserByKey, updateUserToken } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-env';
const JWT_EXPIRES_IN = '8h';

export async function POST(request: Request) {
  try {
    const { accessKey } = await request.json();

    if (!accessKey) {
        return NextResponse.json({ error: 'Access Key is required.' }, { status: 400 });
    }

    const user = await getUserByKey(accessKey);

    if (!user) {
        console.log(`[LOGIN_FAIL] Invalid access key attempted: ${accessKey}`);
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

    console.log(`[LOGIN] Successful login for: ${user.operatorId}`);

    return NextResponse.json({
        operatorId: user.operatorId,
        securityLevel: user.securityLevel,
        token: token
    });

  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: 'Authentication process failed.', details: error.message }, { status: 500 });
  }
}
