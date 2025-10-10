import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const abmPageUpdateSchema = z.object({
  linkedinUrl: z.string().url().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  title: z.string().nullable().optional(),
  company: z.string().min(1).optional(),
  targetMarket: z.string().min(1).optional(),
  targetLocation: z.string().min(1).optional(),
  mockCompanies: z.array(z.string()).optional(),
  mockLeads: z
    .array(
      z.object({
        name: z.string(),
        company: z.string(),
        title: z.string(),
      })
    )
    .optional(),
  mockAnalytics: z
    .object({
      replies: z.number(),
      meetings: z.number(),
      openRate: z.number(),
      replyRate: z.number(),
    })
    .optional(),
  heroMessage: z.string().nullable().optional(),
  benefitPoints: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = abmPageUpdateSchema.parse(body);

    const abmPage = await db.aBMPage.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(abmPage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', issues: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating ABM page:', error);
    return NextResponse.json(
      { error: 'Failed to update ABM page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.aBMPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ABM page:', error);
    return NextResponse.json(
      { error: 'Failed to delete ABM page' },
      { status: 500 }
    );
  }
}

