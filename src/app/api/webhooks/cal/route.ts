import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Cal.com webhook payload structure (simplified)
    // You'll need to adjust this based on actual Cal.com webhook format
    const { triggerEvent, payload } = body;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Find booking by providerId (Cal.com booking UID)
    const booking = await db.booking.findFirst({
      where: { providerId: payload.uid },
    });

    if (!booking) {
      // If no booking found, this might be a new booking from Cal.com
      console.log('No booking found for Cal.com webhook:', payload.uid);
      return NextResponse.json({ received: true });
    }

    // Update booking based on event type
    switch (triggerEvent) {
      case 'BOOKING_CREATED':
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CONFIRMED',
            startTime: payload.startTime ? new Date(payload.startTime) : undefined,
            endTime: payload.endTime ? new Date(payload.endTime) : undefined,
          },
        });
        break;

      case 'BOOKING_CANCELLED':
        await db.booking.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED' },
        });
        break;

      case 'BOOKING_RESCHEDULED':
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'RESCHEDULED',
            startTime: payload.startTime ? new Date(payload.startTime) : undefined,
            endTime: payload.endTime ? new Date(payload.endTime) : undefined,
          },
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Cal.com webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

