
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    cookies().delete('__session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session Logout Error:', error);
    return new NextResponse('Failed to log out.', { status: 400 });
  }
}
