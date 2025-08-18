
import { getAdminPages } from '@/lib/firestore-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allPages = await getAdminPages();
    const publishedPages = allPages.filter(p => p.isPublished);
    return NextResponse.json(publishedPages);
  } catch (error) {
    console.error('API Error fetching pages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
