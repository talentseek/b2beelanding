import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret (optional but recommended)
    const webhookSecret = process.env.CALCOM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get('x-cal-signature-256');
      console.log('[Cal Webhook] Signature:', signature ? 'present' : 'missing');
    }

    const body = await req.json();
    
    // Log the entire payload for debugging
    console.log('[Cal Webhook] ===== FULL PAYLOAD =====');
    console.log(JSON.stringify(body, null, 2));
    console.log('[Cal Webhook] =======================');

    // Cal.com webhook payload structure
    const { triggerEvent, payload } = body;
    
    console.log('[Cal Webhook] Event:', triggerEvent);
    console.log('[Cal Webhook] UID:', payload?.uid);
    console.log('[Cal Webhook] Attendees:', payload?.attendees);

    // Handle PING events (test webhooks don't have uid)
    if (triggerEvent === 'PING') {
      console.log('[Cal Webhook] ✅ PING received - webhook is configured correctly!');
      return NextResponse.json({ 
        received: true,
        message: 'Webhook configured successfully' 
      });
    }

    // Real booking events should have a uid
    if (!payload?.uid) {
      console.error('[Cal Webhook] Invalid webhook payload: missing uid');
      console.error('[Cal Webhook] Payload:', payload);
      return NextResponse.json({ 
        error: 'Invalid webhook payload - missing uid',
        received: body 
      }, { status: 400 });
    }

    // Find booking by providerId (Cal.com booking UID)
    const booking = await db.booking.findFirst({
      where: { providerId: payload.uid },
    });

    if (!booking) {
      // If no booking found, try to find lead by email and create booking
      console.log('[Cal Webhook] No existing booking found for:', payload.uid);
      
      // Try multiple ways to find the email
      const email = payload.attendees?.[0]?.email || 
                   payload.responses?.email || 
                   payload.metadata?.email;
      
      console.log('[Cal Webhook] Extracted email:', email);
      
      if (email) {
        const lead = await db.lead.findFirst({
          where: { email: email },
          orderBy: { createdAt: 'desc' },
        });

        if (lead) {
          console.log('[Cal Webhook] ✅ Found lead by email:', lead.id, lead.email);
          console.log('[Cal Webhook] Lead has beeId:', lead.beeId);
          
          const newBooking = await db.booking.create({
            data: {
              leadId: lead.id,
              beeId: lead.beeId, // Associate with the same bee as the lead
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

          console.log('[Cal Webhook] ✅ Booking created successfully:', newBooking.id);
          console.log('[Cal Webhook] Lead status updated to BOOKED');
          
          return NextResponse.json({ 
            received: true, 
            bookingCreated: true,
            bookingId: newBooking.id 
          });
        } else {
          console.log('[Cal Webhook] ❌ No lead found with email:', email);
        }
      } else {
        console.log('[Cal Webhook] ❌ No email found in payload');
        console.log('[Cal Webhook] Tried: attendees[0].email, responses.email, metadata.email');
      }

      return NextResponse.json({ 
        received: true,
        bookingCreated: false,
        reason: email ? 'Lead not found' : 'Email not found in payload'
      });
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

