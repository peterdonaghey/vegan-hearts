import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { verifyAuthToken } from '@/lib/auth';

const region = (process.env.AWS_REGION || 'us-east-1').trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

const BUCKET = 'vegan-hearts-email-storage';
const PREFIX = 'emails/';

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

/**
 * Properly parse RFC 2822 headers that may span multiple lines (folded headers).
 * Reads header section until the first empty line.
 */
function parseRawEmail(raw: string) {
  // Split headers from body at the first blank line
  const headerEnd = raw.search(/\r?\n\r?\n/);
  if (headerEnd === -1) return { headers: {}, body: raw };

  const headerSection = raw.slice(0, headerEnd);
  const body = raw.slice(headerEnd + 2).replace(/^\r?\n/, ''); // skip the blank line

  const headers: Record<string, string> = {};

  // Unfold folded headers (lines starting with whitespace are continuations)
  const unfolded = headerSection.replace(/\r?\n\s+/g, ' ');

  // Parse each header line
  const headerRegex = /^([\w-]+):\s*(.*)$/gm;
  let match;
  while ((match = headerRegex.exec(unfolded)) !== null) {
    const name = match[1].toLowerCase();
    // Keep the last value if duplicate (some headers repeat)
    headers[name] = match[2].trim();
  }

  // Clean transfer encoding: decode quoted-printable in the body
  const contentType = headers['content-type'] || '';
  const isQP = contentType.includes('quoted-printable');
  const transferEncoding = headers['content-transfer-encoding'] || '';
  const isBase64 = transferEncoding.toLowerCase().includes('base64');

  let cleanBody = body;
  if (isQP) {
    cleanBody = cleanBody
      .replace(/=\r?\n/g, '')      // soft line breaks
      .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/[^\x20-\x7E\r\n]/g, ''); // strip non-printable
  }

  // Extract plain text part from multipart if needed
  if (contentType.includes('multipart/')) {
    // Try to find the text/plain part
    const textPlainMatch = cleanBody.match(
      /Content-Type:\s*text\/plain[\s\S]*?(?:\r?\n\r?\n)([\s\S]*?)(?:\r?\n--|$)/
    );
    if (textPlainMatch) {
      cleanBody = textPlainMatch[1]
        .replace(/=\r?\n/g, '')
        .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    }
  }

  return {
    from: headers['from'] || '',
    to: headers['to'] || '',
    subject: headers['subject'] || '',
    date: headers['date'] || '',
    body: cleanBody.trim(),
    isSystemEmail:
      headers['subject']?.includes('Amazon SES Setup Notification') ||
      headers['to']?.includes('recipient@example.com') ||
      headers['from']?.includes('amazonses.com'),
  };
}

// GET /api/admin-inbox?limit=20&nextToken=...
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const payload = await verifyAuthToken(authHeader);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const continuationToken = searchParams.get('nextToken') || undefined;

  try {
    const listResult = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: PREFIX,
        MaxKeys: limit,
        ContinuationToken: continuationToken,
      })
    );

    const items = [];
    for (const obj of (listResult.Contents || [])) {
      if (!obj.Key || obj.Key === PREFIX || (obj.Key.endsWith('/'))) continue;

      // Read enough to get the full email (up to 100KB per email)
      const rangeSize = Math.min(obj.Size || 102400, 102400);
      const data = await s3Client.send(
        new GetObjectCommand({
          Bucket: BUCKET,
          Key: obj.Key,
          Range: `bytes=0-${rangeSize}`,
        })
      );
      const raw = await data.Body?.transformToString() || '';
      const parsed = parseRawEmail(raw);

      // Filter out system/notification emails
      if (parsed.isSystemEmail) continue;

      items.push({
        id: obj.Key!.replace(PREFIX, ''),
        from: parsed.from,
        to: parsed.to,
        subject: parsed.subject,
        date: parsed.date,
        body: parsed.body,
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified?.toISOString(),
      });
    }

    // Sort by date descending (newest first)
    items.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : (a.lastModified ? new Date(a.lastModified).getTime() : 0);
      const dateB = b.date ? new Date(b.date).getTime() : (b.lastModified ? new Date(b.lastModified).getTime() : 0);
      return dateB - dateA;
    });

    return NextResponse.json({
      items,
      nextToken: listResult.NextContinuationToken || null,
      isTruncated: listResult.IsTruncated || false,
    });
  } catch (error: any) {
    console.error('Error listing inbox:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inbox' },
      { status: 500 }
    );
  }
}
