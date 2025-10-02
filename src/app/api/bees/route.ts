import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bees = await db.bee.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        testimonials: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ bees });
  } catch (error) {
    console.error('Error fetching bees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bees' },
      { status: 500 }
    );
  }
}

