import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { Resend } from 'resend';

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  beeSlug: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    console.log('[Lead API] Received lead submission request');
    
    const body = await req.json();
    console.log('[Lead API] Request body:', JSON.stringify(body, null, 2));
    
    const validatedData = leadSchema.parse(body);
    console.log('[Lead API] Validation successful');

    // Find bee if beeSlug is provided
    let bee = null;
    if (validatedData.beeSlug) {
      console.log('[Lead API] Looking up bee:', validatedData.beeSlug);
      bee = await db.bee.findUnique({
        where: { slug: validatedData.beeSlug },
      });
      console.log('[Lead API] Bee found:', bee ? bee.name : 'none');
    }

    // Create lead
    console.log('[Lead API] Creating lead in database...');
    const lead = await db.lead.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        company: validatedData.company || undefined,
        notes: validatedData.notes || undefined,
        beeId: bee?.id,
        utmSource: validatedData.utmSource || undefined,
        utmMedium: validatedData.utmMedium || undefined,
        utmCampaign: validatedData.utmCampaign || undefined,
        referrer: validatedData.referrer || undefined,
      },
    });

    console.log('[Lead API] Lead created successfully:', lead.id);

    // Send notification email
    if (resend && process.env.RESEND_FROM_EMAIL && process.env.RESEND_NOTIFY_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RESEND_NOTIFY_EMAIL,
          subject: `New Lead: ${lead.firstName} ${lead.lastName}`,
          html: `
            <h2>New Lead Submission</h2>
            <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
            ${bee ? `<p><strong>Interested in:</strong> ${bee.name}</p>` : ''}
            ${lead.notes ? `<p><strong>Notes:</strong> ${lead.notes}</p>` : ''}
            <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Prepare Cal.com prefill data
    const calPrefill = {
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      notes: [
        lead.company && `Company: ${lead.company}`,
        bee && `Interested in: ${bee.name}`,
        lead.notes,
      ]
        .filter(Boolean)
        .join('\n'),
    };

    console.log('[Lead API] Returning success response');
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      calPrefill,
    });
  } catch (error) {
    console.error('[Lead API] Error creating lead:', error);
    console.error('[Lead API] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

