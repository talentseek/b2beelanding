import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendReminderEmail } from '@/lib/emails';

// Manual test endpoint to send a reminder immediately
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`[Test Reminder] Looking for lead with email: ${email}`);

    // Find the lead
    const lead = await db.lead.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
      include: {
        bee: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: `No lead found with email: ${email}` },
        { status: 404 }
      );
    }

    console.log(`[Test Reminder] Found lead:`, {
      id: lead.id,
      status: lead.status,
      reminderSentAt: lead.reminderSentAt,
      createdAt: lead.createdAt,
    });

    // Check if already sent
    if (lead.reminderSentAt) {
      return NextResponse.json(
        {
          message: 'Reminder already sent to this lead',
          sentAt: lead.reminderSentAt,
        },
        { status: 200 }
      );
    }

    // Check if already booked
    if (lead.status !== 'NEW') {
      return NextResponse.json(
        {
          message: `Lead status is ${lead.status}, not eligible for reminder`,
        },
        { status: 200 }
      );
    }

    // Send reminder email
    console.log(`[Test Reminder] Sending reminder to ${email}`);
    const success = await sendReminderEmail(lead);

    if (success) {
      // Mark as sent
      await db.lead.update({
        where: { id: lead.id },
        data: { reminderSentAt: new Date() },
      });

      console.log(`[Test Reminder] ✅ Reminder sent successfully`);

      return NextResponse.json({
        success: true,
        message: 'Reminder email sent successfully',
        lead: {
          id: lead.id,
          email: lead.email,
          name: `${lead.firstName} ${lead.lastName}`,
          bee: lead.bee?.name,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send reminder email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Test Reminder] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test reminder',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test reminder endpoint - POST with { "email": "user@example.com" }',
  });
}

