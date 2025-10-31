import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET single marina ABM page
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await db.aBMMarinasPage.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const page = await db.aBMMarinasPage.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.aBMMarinasPage.delete({
      where: { id },
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

