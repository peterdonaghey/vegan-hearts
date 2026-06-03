import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { verifyAuthToken } from '@/lib/auth';
import { randomUUID } from 'crypto';

const region = (process.env.AWS_REGION || 'us-east-1').trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const BUCKET_NAME = 'vegan-hearts-assets';

// POST - Upload video for news articles (admin only)
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      console.error('Video upload failed: Unauthorized - no valid auth token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('Video upload failed: No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Video upload attempt:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
    });

    // No file type or size restrictions — accepts any video format up to S3 object limit (~5TB)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `news/videos/${randomUUID()}.${fileExtension}`;

    console.log('Uploading video to S3:', {
      bucket: BUCKET_NAME,
      key: fileName,
      region,
    });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    // Generate public URL
    const videoUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

    console.log('Video upload successful:', {
      url: videoUrl,
      fileName,
    });

    return NextResponse.json({
      success: true,
      url: videoUrl,
      fileName,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: `Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

