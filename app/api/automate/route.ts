import { NextResponse } from 'next/server';

/**
 * Next.js 15+ App Router Handler
 * This route proxies requests to Make.com to keep your Webhook URLs hidden 
 * from the client-side browser and to handle medical data routing securely.
 */

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming JSON body from the Next.js frontend
    const body = await req.json();

    // 2. Define your Make.com Webhook URL 
    // In production, move this to an environment variable: process.env.MAKE_WEBHOOK_URL
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_ID';

    // 3. Forward the data to Make.com
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        // Add a timestamp and source for better logging in Make.com
        source: 'Canuck Dentist Website',
        sentAt: new Date().toISOString(),
      }),
    });

    // 4. Handle errors from the external service
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Make.com error:', errorData);
      return NextResponse.json(
        { error: 'Failed to trigger automation' }, 
        { status: response.status }
      );
    }

    // 5. Return success back to the frontend
    return NextResponse.json({ 
      success: true, 
      message: 'Automation triggered successfully' 
    });

  } catch (error: any) {
    // 6. Global error handling for malformed requests or network failures
    console.error('API Route Error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message }, 
      { status: 500 }
    );
  }
}