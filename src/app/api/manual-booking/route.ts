import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Manual endpoint to create a booking for testing
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the most recent lead with this email (include bee info)
    const lead = await db.lead.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
      include: { bee: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: `No lead found with email: ${email}` },
        { status: 404 }
      );
    }

    // Create a booking
    const booking = await db.booking.create({
      data: {
        leadId: lead.id,
        beeId: lead.beeId, // Associate with the same bee as the lead
        providerId: `manual_${Date.now()}`,
        status: 'CONFIRMED',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    });

    // Update lead status
    await db.lead.update({
      where: { id: lead.id },
      data: { status: 'BOOKED' },
    });

    console.log('Manual booking created:', booking.id);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        leadId: lead.id,
        leadName: `${lead.firstName} ${lead.lastName}`,
        beeName: lead.bee?.name || 'None',
        status: booking.status,
        startTime: booking.startTime,
      },
    });
  } catch (error) {
    console.error('Manual booking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Manual booking creation endpoint',
    usage: 'POST { "email": "user@example.com" } to create a test booking',
  });
}

