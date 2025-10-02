import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendReminderEmail } from '@/lib/emails';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('[Cron] Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cron] ===== Running send-reminders job =====');

    // Find leads that:
    // 1. Were created more than 1 minute ago (10 minutes in production)
    // 2. Have status = 'NEW' (not booked)
    // 3. Haven't been sent a reminder yet
    const delayMinutes = parseInt(process.env.REMINDER_DELAY_MINUTES || '1', 10);
    const delayTime = new Date(Date.now() - delayMinutes * 60 * 1000);
    
    console.log(`[Cron] Checking for leads created before ${delayTime.toISOString()} (${delayMinutes} minutes ago)`);

    const leadsToRemind = await db.lead.findMany({
      where: {
        status: 'NEW',
        reminderSentAt: null,
        createdAt: {
          lte: delayTime,
        },
      },
      include: {
        bee: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 50, // Process max 50 at a time to avoid timeouts
    });

    console.log(`[Cron] Found ${leadsToRemind.length} leads to send reminders to`);

    const results = {
      total: leadsToRemind.length,
      sent: 0,
      failed: 0,
    };

    for (const lead of leadsToRemind) {
      try {
        console.log(`[Cron] Sending reminder to ${lead.email}`);
        
        const success = await sendReminderEmail(lead);

        if (success) {
          // Mark reminder as sent
          await db.lead.update({
            where: { id: lead.id },
            data: { reminderSentAt: new Date() },
          });
          results.sent++;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error(`[Cron] Error sending reminder to ${lead.email}:`, error);
        results.failed++;
      }
    }

    console.log('[Cron] Send-reminders job completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Reminder job completed',
      results,
    });
  } catch (error) {
    console.error('[Cron] Send-reminders job failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

