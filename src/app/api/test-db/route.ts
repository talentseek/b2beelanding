import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const leadCount = await db.lead.count();
    const beeCount = await db.bee.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        leads: leadCount,
        bees: beeCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

