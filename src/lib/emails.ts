import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@notifications.b2bee.ai';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://b2bee.ai';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  bee?: {
    name: string;
    slug: string;
  } | null;
}

interface Booking {
  id: string;
  startTime?: Date | null;
  lead: Lead;
  bee?: {
    name: string;
  } | null;
}

export async function sendReminderEmail(lead: Lead): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] Resend not configured, skipping reminder email');
    return false;
  }

  try {
    const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'https://cal.com';
    const calUrl = new URL(calLink);
    
    // Pre-fill Cal.com with lead details
    calUrl.searchParams.set('name', `${lead.firstName} ${lead.lastName}`);
    calUrl.searchParams.set('email', lead.email);
    if (lead.company) {
      calUrl.searchParams.set('notes', `Company: ${lead.company}`);
    }

    const beeName = lead.bee?.name || 'B2Bee';
    const subject = `Don't miss out! Book your ${beeName} demo`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #f97316; }
            .logo { max-width: 200px; height: auto; }
            .content { padding: 30px 0; }
            .button { display: inline-block; background: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .footer-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${BASE_URL}/logo.png" alt="B2Bee" class="logo" />
          </div>
          
          <div class="content">
            <h2>Hi ${lead.firstName},</h2>
            
            <p>Thanks for your interest in <strong>${beeName}</strong>! We noticed you haven't booked your demo yet.</p>
            
            <div class="highlight">
              <strong>🎯 Why book a demo?</strong>
              <ul>
                <li>See ${beeName} in action with real examples</li>
                <li>Get personalized recommendations for your business</li>
                <li>Ask questions and explore custom solutions</li>
                <li>No commitment required - just a friendly conversation</li>
              </ul>
            </div>
            
            <p>We've reserved a spot for you. Click below to choose your preferred time:</p>
            
            <div style="text-align: center;">
              <a href="${calUrl.toString()}" class="button">📅 Book Your Free Demo</a>
            </div>
            
            <p>Our AI Bees are standing by, ready to show you how they can transform your business. 🐝✨</p>
            
            <p>
              Best regards,<br>
              <strong>The B2Bee Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <img src="${BASE_URL}/logofooter.png" alt="B2Bee" class="footer-logo" />
            <p>B2Bee - AI Automation for Small Business</p>
            <p><a href="${BASE_URL}" style="color: #f97316; text-decoration: none;">www.b2bee.ai</a></p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: subject,
      html: html,
    });

    console.log(`[Email] ✅ Reminder email sent to ${lead.email}`);
    return true;
  } catch (error) {
    console.error('[Email] ❌ Failed to send reminder email:', error);
    return false;
  }
}

export async function sendBookingConfirmationEmail(booking: Booking): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] Resend not configured, skipping confirmation email');
    return false;
  }

  try {
    const { lead } = booking;
    const beeName = booking.bee?.name || 'B2Bee';
    const subject = `Your ${beeName} demo is confirmed! 🎉`;
    
    const startTime = booking.startTime 
      ? new Date(booking.startTime).toLocaleString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        })
      : 'TBD';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #f97316; }
            .logo { max-width: 200px; height: auto; }
            .content { padding: 30px 0; }
            .booking-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .footer-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
            .emoji { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${BASE_URL}/logo.png" alt="B2Bee" class="logo" />
          </div>
          
          <div class="content">
            <h2>Welcome, ${lead.firstName}! 🎉</h2>
            
            <p>We're thrilled to confirm your <strong>${beeName}</strong> demo!</p>
            
            <div class="booking-details">
              <p class="emoji">📅 <strong>Your Demo Details:</strong></p>
              <p><strong>Product:</strong> ${beeName}</p>
              <p><strong>When:</strong> ${startTime}</p>
              <p><strong>Attendee:</strong> ${lead.firstName} ${lead.lastName}</p>
              ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
            </div>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>🎯 Live demonstration of ${beeName} in action</li>
              <li>💡 Personalized recommendations for your business</li>
              <li>🤝 Q&A session with our team</li>
              <li>🚀 Next steps to get started (if you're interested)</li>
            </ul>
            
            <p><strong>How to prepare:</strong></p>
            <ul>
              <li>Have any specific questions or use cases ready</li>
              <li>Think about your current workflow challenges</li>
              <li>Be ready to see how AI can transform your business</li>
            </ul>
            
            <p>We're looking forward to showing you how our AI Bees can bring you the honey! 🐝✨</p>
            
            <p>
              See you soon,<br>
              <strong>The B2Bee Team</strong>
            </p>
            
            <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
              Need to reschedule? You should have received a calendar invite with options to reschedule or cancel.
            </p>
          </div>
          
          <div class="footer">
            <img src="${BASE_URL}/logofooter.png" alt="B2Bee" class="footer-logo" />
            <p>B2Bee - AI Automation for Small Business</p>
            <p><a href="${BASE_URL}" style="color: #f97316; text-decoration: none;">www.b2bee.ai</a></p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: subject,
      html: html,
    });

    console.log(`[Email] ✅ Booking confirmation sent to ${lead.email}`);
    return true;
  } catch (error) {
    console.error('[Email] ❌ Failed to send booking confirmation:', error);
    return false;
  }
}

