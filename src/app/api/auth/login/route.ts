'use server';
import { NextResponse } from 'next/server';

// This is a global in-memory store for demonstration purposes.
// In a real application, you would use a persistent database.
const users: { [key: string]: any } = {
    "Operator-7": {
        operatorId: "Operator-7",
        accessKey: "IRIS-Ut9OWLLQWhB#FEc6awCLdLlZrSUh$WGzLHpvvCbY",
        securityLevel: "3.1",
        token: "dummy-token-for-op7",
        privateKey: "dummy-private-key-for-op7"
    }
};

export async function POST(request: Request) {
  try {
    const { accessKey } = await request.json();

    if (!accessKey) {
        return NextResponse.json({ error: 'Access Key is required.' }, { status: 400 });
    }

    // Find user by accessKey (highly inefficient, for demo only)
    const user = Object.values(users).find(u => u.accessKey === accessKey);

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    console.log(`[LOGIN] Successful login for: ${user.operatorId}`);

    // Return user info, but omit sensitive data like the key itself
    return NextResponse.json({
        operatorId: user.operatorId,
        securityLevel: user.securityLevel,
        token: user.token
    });

  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: 'Authentication failed.', details: error.message }, { status: 500 });
  }
}
