import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const contributions = await db.boatFundContribution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const total = await db.boatFundContribution.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      contributions,
      total: total._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching boat fund:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boat fund' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { amount, description } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const contribution = await db.boatFundContribution.create({
      data: {
        amount: Math.round(amount), // Ensure it's an integer (pence)
        description: description || 'Contribution',
      },
    });

    return NextResponse.json(contribution);
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json(
      { error: 'Failed to create contribution' },
      { status: 500 }
    );
  }
}

