# VeganHearts Public Files - S3 Bucket

## Overview

Public S3 bucket for hosting downloadable files that don't require authentication.

**Bucket Name:** `vegan-hearts-public-files`  
**Region:** `us-east-1`  
**Access:** Public read access (no authentication required)

## Current Files

### Ebooks

- **Awakening Your Vegan Heart - 21 Days**
  - Path: `ebooks/awakening-your-vegan-heart-21-days.pdf`
  - Size: 9.4 MB
  - URL: https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf
  - Used in: Ebook download email (`/app/api/ebook-download/route.ts`)

## Uploading New Files

### Using AWS CLI

```bash
# Upload a file
aws s3 cp <local-file> s3://vegan-hearts-public-files/<path>/<filename> \
  --profile peterdonaghey \
  --region us-east-1 \
  --content-type <mime-type>

# Example: Upload a PDF
aws s3 cp "myebook.pdf" s3://vegan-hearts-public-files/ebooks/myebook.pdf \
  --profile peterdonaghey \
  --region us-east-1 \
  --content-type application/pdf \
  --content-disposition 'attachment; filename="My Ebook.pdf"'
```

### Common MIME Types

- PDF: `application/pdf`
- Image (JPEG): `image/jpeg`
- Image (PNG): `image/png`
- Video (MP4): `video/mp4`
- Audio (MP3): `audio/mpeg`

## Public Access Configuration

The bucket is configured with:
- Public read access enabled
- Bucket policy allowing `s3:GetObject` for all users
- No authentication required for downloads

## URL Format

Files are accessible at:
```
https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/<path>/<filename>
```

## Security Notes

⚠️ **Important:** Only upload files intended for public access. All files in this bucket are publicly downloadable by anyone with the URL.

## Costs

- **Storage:** $0.023/GB/month for standard storage
- **Data Transfer:** First 1 GB/month free, then $0.09/GB
- **Requests:** $0.0004 per 1,000 GET requests

**Current monthly cost (9.4 MB ebook):** ~$0.001/month storage + minimal transfer costs

## Managing Files

### List all files
```bash
aws s3 ls s3://vegan-hearts-public-files/ \
  --profile peterdonaghey \
  --recursive \
  --human-readable
```

### Delete a file
```bash
aws s3 rm s3://vegan-hearts-public-files/<path>/<filename> \
  --profile peterdonaghey
```

### Update a file
Just upload with the same path - S3 will overwrite the existing file.

## Updating Email Templates

When changing file URLs, remember to update:
1. `/app/api/ebook-download/route.ts` - HTML and text email templates
2. Test the download link after updating
3. Clear CloudFront cache if using CDN (future enhancement)

