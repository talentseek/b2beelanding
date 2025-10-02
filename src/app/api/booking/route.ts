import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const bookingSchema = z.object({
  leadId: z.string(),
  providerId: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  beeSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    // Find bee if beeSlug is provided
    let bee = null;
    if (validatedData.beeSlug) {
      bee = await db.bee.findUnique({
        where: { slug: validatedData.beeSlug },
      });
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        leadId: validatedData.leadId,
        providerId: validatedData.providerId,
        startTime: validatedData.startTime
          ? new Date(validatedData.startTime)
          : undefined,
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
        beeId: bee?.id,
        status: 'PENDING',
      },
    });

    // Update lead status to BOOKED
    await db.lead.update({
      where: { id: validatedData.leadId },
      data: { status: 'BOOKED' },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

