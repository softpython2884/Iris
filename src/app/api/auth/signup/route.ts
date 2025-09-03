'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createUser, getUserByOperatorId } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

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
    // 1. Authenticate and authorize the request
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    
    // 2. Check for admin privileges
    if (authResult.decodedToken.securityLevel !== '7') {
        return NextResponse.json({ error: 'Insufficient permissions. Administrator access required.' }, { status: 403 });
    }
    
    console.log(`[SIGNUP_REQUEST] Authorized by: ${authResult.decodedToken.operatorId}`);

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
    // In a real scenario, you'd want to log this error event as well.
    return NextResponse.json({ error: 'Failed to create operator profile.', details: error.message }, { status: 500 });
  }
}
