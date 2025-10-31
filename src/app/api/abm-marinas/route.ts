import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all marina ABM pages
export async function GET() {
  try {
    const pages = await prisma.aBMMarinasPage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('[ABM Marinas API] Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marina ABM pages' },
      { status: 500 }
    );
  }
}

// POST create new marina ABM page
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      linkedinIdentifier,
      linkedinUrl,
      firstName,
      lastName,
      title,
      company,
      heroMessage,
      isActive,
    } = body;

    // Validate required fields
    if (!linkedinIdentifier || !linkedinUrl || !firstName || !lastName || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const page = await prisma.aBMMarinasPage.create({
      data: {
        linkedinIdentifier,
        linkedinUrl,
        firstName,
        lastName,
        title: title || null,
        company,
        heroMessage: heroMessage || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('[ABM Marinas API] Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create marina ABM page' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

