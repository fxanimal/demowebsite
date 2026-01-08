import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Trigger Make.com Webhook
    const makeRes = await fetch('https://hook.us1.make.com/YOUR_CHAT_WEBHOOK_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        timestamp: new Date().toISOString()
      }),
    });

    const data = await makeRes.json();

    // Make.com should return a JSON like: { "reply": "Our main intersection is..." }
    return NextResponse.json({ reply: data.reply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reach AI Assistant' }, { status: 500 });
  }
}