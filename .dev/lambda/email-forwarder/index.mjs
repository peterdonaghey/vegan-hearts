import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const s3 = new S3Client({});
const ses = new SESClient({});

function extractBody(rawEmail) {
  const parts = rawEmail.split(/\r?\n\r?\n/);
  if (parts.length < 2) return rawEmail;
  const body = parts.slice(1).join('\n\n');
  return body
    .replace(/=\r?\n/g, '')
    .replace(/=[0-9A-F]{2}/g, (match) => String.fromCharCode(parseInt(match.substring(1), 16)))
    .trim();
}

function pickVerifiedSource(destination) {
  const d = (destination || []).map((x) => String(x).toLowerCase());
  if (d.some((x) => x === 'hello@veganhearts.org' || x.startsWith('hello@veganhearts.org')))
    return 'hello@veganhearts.org';
  if (d.some((x) => x === 'education@veganhearts.org' || x.startsWith('education@veganhearts.org')))
    return 'education@veganhearts.org';
  if (d.some((x) => x.includes('vegan-hearts.org')))
    return 'education@vegan-hearts.org';
  return 'hello@veganhearts.org';
}

export const handler = async (event) => {
  const record = event.Records[0];
  const messageId = record.ses.mail.messageId;
  const bucket = process.env.BUCKET;
  const forwardTo = process.env.FORWARD_TO;

  const destination = record.ses.mail.destination || [];
  const sourceAddr = pickVerifiedSource(destination);

  try {
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: `emails/${messageId}`,
      }),
    );

    const rawEmail = await data.Body.transformToString();
    const subject = record.ses.mail.commonHeaders.subject || '(no subject)';
    const fromList = record.ses.mail.commonHeaders.from || ['unknown'];
    const from = fromList[0];
    const fromEmail = from.match(/<(.+)>/) ? from.match(/<(.+)>/)[1] : from;
    const messageBody = extractBody(rawEmail);

    const cleanBody = `Delivered-To: ${destination.join(', ')}
From: ${from}
Subject: ${subject}

────────────────────────────────

${messageBody}`;

    await ses.send(
      new SendEmailCommand({
        Source: sourceAddr,
        Destination: { ToAddresses: [forwardTo] },
        ReplyToAddresses: [fromEmail],
        Message: {
          Subject: { Data: `[vh] ${subject}` },
          Body: { Text: { Data: cleanBody } },
        },
      }),
    );

    console.log(`Forwarded (${sourceAddr}) from ${from} → ${forwardTo}`);
    return { statusCode: 200 };
  } catch (error) {
    console.error('Forwarding error:', error);
    throw error;
  }
};
