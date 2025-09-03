'use server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addUser } from './../login/route';

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
    const { operatorId, securityLevel, subLevel } = await request.json();

    if (!operatorId || !securityLevel) {
        return NextResponse.json({ error: 'Operator ID and Security Level are required.' }, { status: 400 });
    }

    // In a real app, you would check if the user making this request has permissions (e.g. Level 7)
    
    const accessKey = generateAccessKey();
    const token = crypto.randomBytes(32).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    
    const newUser = {
      operatorId,
      accessKey,
      securityLevel: subLevel ? `${securityLevel}.${subLevel}` : String(securityLevel),
      token,
      privateKey,
    };

    addUser(newUser); // Add user to our in-memory store
    
    console.log(`[SIGNUP] New user created:`, { operatorId: newUser.operatorId, securityLevel: newUser.securityLevel });

    // Return the generated key so the admin can give it to the new user.
    return NextResponse.json({ accessKey, token, privateKey });

  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json({ error: 'Failed to create operator profile.', details: error.message }, { status: 500 });
  }
}
