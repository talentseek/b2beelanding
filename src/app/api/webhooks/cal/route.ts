import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret (optional but recommended)
    const webhookSecret = process.env.CALCOM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get('x-cal-signature-256');
      // In production, you'd verify the signature here
      // For now, we'll just log it
      console.log('Cal.com webhook signature:', signature ? 'present' : 'missing');
    }

    const body = await req.json();
    console.log('Cal.com webhook received:', { triggerEvent: body.triggerEvent, uid: body.payload?.uid });

    // Cal.com webhook payload structure
    const { triggerEvent, payload } = body;

    if (!payload?.uid) {
      console.error('Invalid webhook payload: missing uid');
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Find booking by providerId (Cal.com booking UID)
    const booking = await db.booking.findFirst({
      where: { providerId: payload.uid },
    });

    if (!booking) {
      // If no booking found, try to find lead by email and create booking
      console.log('No booking found for Cal.com webhook:', payload.uid);
      
      if (payload.attendees?.[0]?.email) {
        const lead = await db.lead.findFirst({
          where: { email: payload.attendees[0].email },
          orderBy: { createdAt: 'desc' },
        });

        if (lead) {
          console.log('Found lead by email, creating booking:', lead.id);
          await db.booking.create({
            data: {
              leadId: lead.id,
              providerId: payload.uid,
              status: triggerEvent === 'BOOKING_CREATED' ? 'CONFIRMED' : 'PENDING',
              startTime: payload.startTime ? new Date(payload.startTime) : undefined,
              endTime: payload.endTime ? new Date(payload.endTime) : undefined,
            },
          });

          await db.lead.update({
            where: { id: lead.id },
            data: { status: 'BOOKED' },
          });

          console.log('Booking created successfully for lead:', lead.id);
        }
      }

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

