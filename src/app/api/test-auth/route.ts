import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if admin user exists
    const user = await db.user.findUnique({
      where: { email: 'michael@costperdemo.com' },
      include: { accounts: true },
    });

    return NextResponse.json({
      success: true,
      userExists: !!user,
      userEmail: user?.email,
      hasAccount: !!user?.accounts.length,
      accountProvider: user?.accounts[0]?.providerId,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}

