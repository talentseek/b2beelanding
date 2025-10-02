import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to see what Cal.com actually sends
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = Object.fromEntries(req.headers.entries());

    console.log('=== WEBHOOK TEST ===');
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('===================');

    return NextResponse.json({
      success: true,
      message: 'Webhook received and logged',
      receivedData: {
        headers: headers,
        body: body,
      },
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process test webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test webhook endpoint - POST a Cal.com webhook here to see the payload',
    usage: 'POST to this endpoint with your Cal.com webhook data',
  });
}

