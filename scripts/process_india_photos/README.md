# India Photos Processing Script

Process India trip photos using Claude Haiku Vision API with structured Pydantic output.

## Setup

1. Install dependencies:
```bash
cd scripts
pip install -r requirements.txt
```

2. Create `.env` file in `scripts/` directory:
```bash
# scripts/.env
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from: https://console.anthropic.com/

## Usage

```bash
cd scripts
python3 process_india_photos.py
```

## What it does

1. **Analyzes each image** using Claude Haiku Vision API
2. **Generates structured metadata** with Pydantic:
   - Detailed description (2-3 sentences)
   - Short alt text (accessibility)
   - SEO-friendly filename
   - Primary subject & mood
   - Suggested website uses
   - People/animals detection
3. **Gets image dimensions** (width, height, orientation, megapixels)
4. **Uploads to S3** at `s3://vegan-hearts-assets/india-documentary/`
5. **Creates manifest files**:
   - `.dev/india-photos-manifest.json` (structured data)
   - `.dev/india-photos-catalog.md` (human-readable with previews)

## Output

The script will create:
- Uploaded images in S3 with descriptive filenames
- JSON manifest for programmatic access
- Markdown catalog for easy browsing
- Console output showing progress

## Next Steps

After processing:
1. Review `.dev/india-photos-catalog.md`
2. Choose images for homepage (issue #23)
3. Choose images for documentary article (issue #20)
4. Update website code to use new S3 URLs

