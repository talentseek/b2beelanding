import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const abmPageSchema = z.object({
  linkedinIdentifier: z.string().min(1),
  linkedinUrl: z.string().url(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().nullable(),
  company: z.string().min(1),
  targetMarket: z.string().min(1),
  targetLocation: z.string().min(1),
  mockCompanies: z.array(z.string()),
  mockLeads: z.array(
    z.object({
      name: z.string(),
      company: z.string(),
      title: z.string(),
    })
  ),
  mockAnalytics: z.object({
    replies: z.number(),
    meetings: z.number(),
    openRate: z.number(),
    replyRate: z.number(),
  }),
  heroMessage: z.string().nullable(),
  benefitPoints: z.array(z.string()),
  isActive: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = abmPageSchema.parse(body);

    // Check if identifier already exists
    const existing = await db.aBMPage.findUnique({
      where: { linkedinIdentifier: validated.linkedinIdentifier },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An ABM page with this LinkedIn identifier already exists' },
        { status: 400 }
      );
    }

    const abmPage = await db.aBMPage.create({
      data: validated,
    });

    return NextResponse.json(abmPage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', issues: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating ABM page:', error);
    return NextResponse.json(
      { error: 'Failed to create ABM page' },
      { status: 500 }
    );
  }
}

