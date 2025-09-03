'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory user store (for simulation)
const users: any = {};

export async function POST(request: Request) {
  try {
    const { operatorId, accessKey, securityLevel, subLevel } = await request.json();

    if (users[operatorId]) {
      return NextResponse.json({ error: 'Operator ID already exists.' }, { status: 409 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    
    users[operatorId] = {
      operatorId,
      accessKey, // In a real app, this would be hashed
      securityLevel: subLevel ? `${securityLevel}.${subLevel}` : String(securityLevel),
      token,
      privateKey,
    };
    
    console.log(`[SIGNUP] New user created:`, users[operatorId]);

    return NextResponse.json({ token, privateKey });

  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json({ error: 'Failed to create operator profile.', details: error.message }, { status: 500 });
  }
}
