
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { token } = await request.json();
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });
    
    cookies().set('__session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session Login Error:', error);
    return new NextResponse('Failed to create session.', { status: 400 });
  }
}
