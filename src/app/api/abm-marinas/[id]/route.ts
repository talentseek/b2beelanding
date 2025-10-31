import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single marina ABM page
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.aBMMarinasPage.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('[ABM Marinas API] Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marina ABM page' },
      { status: 500 }
    );
  }
}

// PUT update marina ABM page
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const page = await prisma.aBMMarinasPage.update({
      where: { id: params.id },
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

    return NextResponse.json({ page });
  } catch (error) {
    console.error('[ABM Marinas API] Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update marina ABM page' },
      { status: 500 }
    );
  }
}

// DELETE marina ABM page
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.aBMMarinasPage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ABM Marinas API] Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete marina ABM page' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

