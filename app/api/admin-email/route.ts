import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { verifyAuthToken } from '@/lib/auth';

const region = (process.env.AWS_REGION || 'us-east-1').trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

// All verified from-addresses available at veganhearts.org
const FROM_ADDRESSES = [
  { label: 'Education', email: 'education@veganhearts.org' },
  { label: 'Hello / General', email: 'hello@veganhearts.org' },
  { label: 'Info', email: 'info@veganhearts.org' },
] as const;

const sesClient = new SESClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export async function POST(request: Request) {
  // Verify admin authentication
  const authHeader = request.headers.get('authorization');
  const payload = await verifyAuthToken(authHeader);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fromAddress, toAddresses, subject, body: emailBody } = body;

    // Validate from address is one of the allowed ones
    const validFrom = FROM_ADDRESSES.find((a) => a.email === fromAddress);
    if (!validFrom) {
      return NextResponse.json(
        { error: `Invalid from address. Allowed: ${FROM_ADDRESSES.map((a) => a.email).join(', ')}` },
        { status: 400 }
      );
    }

    // Validate to addresses
    if (!toAddresses || !Array.isArray(toAddresses) || toAddresses.length === 0) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
    }

    const invalidEmails = toAddresses.filter(
      (e: string) => !e.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    );
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    if (!subject || subject.trim().length === 0) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    if (!emailBody || emailBody.trim().length === 0) {
      return NextResponse.json({ error: 'Email body is required' }, { status: 400 });
    }

    // Build proper email HTML document — raw fragments get mangled by Gmail
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    img { max-width: 100% !important; height: auto !important; display: block !important; }
  </style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;background-color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
  ${emailBody}
  </div>
</body>
</html>`;

    // Send via SES
    await sesClient.send(
      new SendEmailCommand({
        Source: validFrom.email,
        Destination: {
          ToAddresses: toAddresses,
        },
        Message: {
          Subject: {
            Data: subject.trim(),
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: 'UTF-8',
            },
            Text: {
              Data: emailBody.replace(/<[^>]+>/g, ''),
              Charset: 'UTF-8',
            },
          },
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: `Email sent from ${validFrom.email} to ${toAddresses.join(', ')}`,
    });
  } catch (error: any) {
    console.error('Error sending admin email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email. Please try again.',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
