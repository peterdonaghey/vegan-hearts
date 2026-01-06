# India Photos Processing - Setup Complete

## What Was Created

### 1. Processing Script
**Location:** `scripts/process_india_photos.py`

Features:
- Uses Claude Haiku Vision API for AI-powered image analysis
- Structured output with Pydantic for consistency
- Automatic dimension detection
- S3 upload with AWS CLI
- Generates comprehensive manifests

### 2. Dependencies
**Location:** `scripts/requirements.txt`

Includes:
- `anthropic` - Claude API client
- `pydantic` - Structured data validation
- `python-dotenv` - Environment variable management
- `pillow` - Image processing
- `boto3` - AWS SDK (for metadata, uses CLI for upload)

### 3. Documentation
**Location:** `scripts/README.md`

Complete setup and usage instructions.

## Next Steps for Peter

### 1. Add Your API Key

Create `scripts/.env` file:
```bash
cd scripts
touch .env
```

Add to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. Install Dependencies

```bash
cd scripts
pip3 install -r requirements.txt
```

### 3. Run the Script

```bash
python3 process_india_photos.py
```

### 4. Review Results

- Check `.dev/india-photos-catalog.md` for all images with previews
- Check `.dev/india-photos-manifest.json` for structured data
- Images will be in S3 at `s3://vegan-hearts-assets/india-documentary/`

## What the Script Does

For each of the 36 images:
1. ✅ Analyzes with Claude Haiku Vision ($0.25 per 1M tokens - very cheap!)
2. ✅ Generates detailed description
3. ✅ Creates SEO-friendly filename
4. ✅ Detects people/animals/mood/subject
5. ✅ Suggests where to use on website
6. ✅ Gets dimensions and technical details
7. ✅ Uploads to S3 with proper naming
8. ✅ Creates manifest for easy reference

## Cost Estimate

- **Claude Haiku Vision**: ~$0.01 for all 36 images
- **S3 Storage**: ~$0.01/month
- **Total**: Negligible

## Why This Approach

- **AI descriptions** = accessibility-compliant alt text
- **Structured metadata** = agent/developer can programmatically use images
- **Automatic categorization** = knows which images for homepage vs article
- **Dimension data** = responsive design decisions
- **S3 URLs** = production-ready, fast CDN delivery

## Integration with Issues

Once processed:
- **Issue #19**: Upload India media ✅ (automated)
- **Issue #20**: Documentary article (use manifest to choose images)
- **Issue #23**: Homepage photos (manifest shows best hero/background images)

