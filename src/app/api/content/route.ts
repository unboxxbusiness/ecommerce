
import { getSiteContent } from '@/lib/firestore-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures the route is not cached

export async function GET() {
  try {
    const siteContent = await getSiteContent();
    return NextResponse.json(siteContent);
  } catch (error) {
    console.error('API Error fetching site content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
