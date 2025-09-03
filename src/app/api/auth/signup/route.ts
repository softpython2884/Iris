'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createUser, getUserByOperatorId } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-env';

function generateAccessKey(): string {
    const prefix = "IRIS-";
    const randomBytes = crypto.randomBytes(24);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$';
    let result = '';
    for (let i = 0; i < randomBytes.length; i++) {
        result += characters.charAt(randomBytes[i] % characters.length);
    }
    return prefix + result;
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the requestor
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Authorization required.' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    // 2. Check permissions
    if (decodedToken.securityLevel !== '7') {
        return NextResponse.json({ error: 'Insufficient permissions. Administrator access required.' }, { status: 403 });
    }
    
    console.log(`[SIGNUP_REQUEST] Authorized by: ${decodedToken.operatorId}`);

    // 3. Proceed with user creation
    const { operatorId, securityLevel, subLevel } = await request.json();

    if (!operatorId || !securityLevel) {
        return NextResponse.json({ error: 'Operator ID and Security Level are required.' }, { status: 400 });
    }
    
    const existingUser = await getUserByOperatorId(operatorId);
    if (existingUser) {
        return NextResponse.json({ error: 'Operator ID already exists.' }, { status: 409 });
    }
    
    const accessKey = generateAccessKey();
    const fullSecurityLevel = subLevel ? `${securityLevel}.${subLevel}` : String(securityLevel);

    await createUser({
      operatorId,
      accessKey,
      securityLevel: fullSecurityLevel,
    });
    
    console.log(`[SIGNUP] New user created:`, { operatorId, securityLevel: fullSecurityLevel });

    // Return the generated key so the admin can give it to the new user.
    return NextResponse.json({ accessKey }, { status: 201 });

  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json({ error: 'Failed to create operator profile.', details: error.message }, { status: 500 });
  }
}
