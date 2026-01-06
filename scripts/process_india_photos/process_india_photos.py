#!/usr/bin/env python3
"""
Process India trip photos using Claude Haiku Vision API
- Analyze each image with AI
- Generate structured descriptions with Pydantic
- Get dimensions
- Upload to S3 with metadata
- Create comprehensive manifest
"""
import os
import json
import base64
import subprocess
from pathlib import Path
from typing import List, Literal
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from anthropic import Anthropic
from PIL import Image

# Load environment variables from scripts/.env
load_dotenv(Path(__file__).parent / '.env')

class ImageAnalysis(BaseModel):
    """Structured image analysis"""
    description: str = Field(
        description="Detailed 2-3 sentence description of the image content, mood, and visual elements"
    )
    short_description: str = Field(
        description="One sentence concise description for alt text (max 120 chars)"
    )
    suggested_filename: str = Field(
        description="SEO-friendly filename using kebab-case (e.g. 'puppy-grass-toy.jpg')"
    )
    primary_subject: Literal[
        "animal", "landscape", "people", "flower", "nature-detail", 
        "mountain", "water", "forest", "sky", "spiritual"
    ] = Field(description="Primary subject category")
    mood: Literal[
        "peaceful", "joyful", "dramatic", "intimate", "majestic", 
        "serene", "vibrant", "contemplative"
    ] = Field(description="Emotional mood of the image")
    suggested_uses: List[Literal[
        "homepage-hero", "documentary-article", "background", 
        "team-section", "nature-connection", "decorative-accent",
        "article-break", "emotional-anchor", "wide-banner"
    ]] = Field(description="Where this image would work best on the website")
    has_people: bool = Field(description="Whether image contains people")
    has_animals: bool = Field(description="Whether image contains animals")
    orientation_preference: Literal["landscape", "portrait", "square"] = Field(
        description="Ideal orientation for this composition"
    )

def encode_image(image_path: str) -> str:
    """Encode image to base64"""
    with open(image_path, "rb") as image_file:
        return base64.standard_b64encode(image_file.read()).decode("utf-8")

def get_image_dimensions(image_path: str) -> dict:
    """Get image dimensions and aspect ratio"""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            orientation = "landscape" if width > height else "portrait" if height > width else "square"
            aspect_ratio = round(width / height, 2)
            return {
                "width": width,
                "height": height,
                "orientation": orientation,
                "aspect_ratio": aspect_ratio,
                "megapixels": round((width * height) / 1000000, 1)
            }
    except Exception as e:
        print(f"  ✗ Error getting dimensions: {e}")
        return None

def analyze_image_with_claude(image_path: str, client: Anthropic) -> ImageAnalysis:
    """Use Claude Haiku Vision to analyze image"""
    print(f"  → Analyzing with Claude Haiku...")
    
    # Encode image
    image_data = encode_image(image_path)
    image_media_type = "image/jpeg"
    
    # Get base filename for suggested name
    base_name = Path(image_path).stem.lower().replace(" ", "-").replace("whatsapp-image-", "india-")
    
    # Create prompt asking for JSON response
    prompt = f"""Analyze this photo from the Vegan Hearts team's documentary trip to India.

Return ONLY a JSON object (no markdown, no explanation) with these exact fields:

{{
  "description": "2-3 detailed sentences about the image content, mood, composition",
  "short_description": "One concise sentence for alt text (max 100 chars)",
  "suggested_filename": "{base_name}.jpg",
  "primary_subject": "one of: animal, landscape, people, flower, nature-detail, mountain, water, forest, sky, spiritual",
  "mood": "one of: peaceful, joyful, dramatic, intimate, majestic, serene, vibrant, contemplative",
  "suggested_uses": ["array of: homepage-hero, documentary-article, background, team-section, nature-connection, decorative-accent, article-break, emotional-anchor, wide-banner"],
  "has_people": true or false,
  "has_animals": true or false,
  "orientation_preference": "landscape, portrait, or square"
}}

Be specific, evocative, and focus on compassion and connection to nature."""

    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ],
            }],
        )
        
        # Extract text response and parse JSON
        analysis_text = response.content[0].text.strip()
        
        # Remove markdown code blocks if present
        if analysis_text.startswith("```"):
            analysis_text = analysis_text.split("```")[1]
            if analysis_text.startswith("json"):
                analysis_text = analysis_text[4:]
            analysis_text = analysis_text.strip()
        
        # Parse JSON
        data = json.loads(analysis_text)
        
        # Create Pydantic model
        return ImageAnalysis(**data)
        
    except json.JSONDecodeError as e:
        print(f"  ✗ JSON parse error: {e}")
        print(f"  Response was: {analysis_text[:200]}...")
        raise
    except Exception as e:
        print(f"  ✗ Claude API error: {e}")
        raise

def upload_to_s3(local_path: str, s3_key: str) -> str:
    """Upload file to S3 using AWS CLI"""
    try:
        cmd = [
            "aws", "--profile", "peterdonaghey",
            "s3", "cp", local_path,
            f"s3://vegan-hearts-assets/{s3_key}",
            "--content-type", "image/jpeg"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            url = f"https://vegan-hearts-assets.s3.us-east-1.amazonaws.com/{s3_key}"
            print(f"  ✓ Uploaded to S3")
            return url
        else:
            print(f"  ✗ S3 upload failed: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"  ✗ Upload error: {e}")
        return None

def process_all_images():
    """Main processing function"""
    # Get API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env file")
        print("Please create scripts/.env with: ANTHROPIC_API_KEY=your_key_here")
        return
    
    # Initialize Claude client
    client = Anthropic(api_key=api_key)
    
    # Get all images
    temp_dir = Path("/Users/peterdonaghey/Projects/vegan-hearts/temp_pics")
    images = sorted(temp_dir.glob("*.jpeg"))
    
    print(f"\n{'='*70}")
    print(f"Processing {len(images)} India Documentary Photos")
    print(f"{'='*70}\n")
    
    results = []
    
    for i, image_path in enumerate(images, 1):
        print(f"[{i}/{len(images)}] {image_path.name}")
        
        try:
            # Get dimensions
            dimensions = get_image_dimensions(str(image_path))
            if not dimensions:
                continue
            
            print(f"  → Dimensions: {dimensions['width']}x{dimensions['height']} ({dimensions['orientation']})")
            
            # Analyze with Claude
            analysis = analyze_image_with_claude(str(image_path), client)
            
            # Upload to S3
            s3_key = f"india-documentary/{analysis.suggested_filename}"
            url = upload_to_s3(str(image_path), s3_key)
            
            if url:
                result = {
                    "original_filename": image_path.name,
                    "new_filename": analysis.suggested_filename,
                    "s3_url": url,
                    "s3_key": s3_key,
                    "description": analysis.description,
                    "alt_text": analysis.short_description,
                    "primary_subject": analysis.primary_subject,
                    "mood": analysis.mood,
                    "suggested_uses": analysis.suggested_uses,
                    "has_people": analysis.has_people,
                    "has_animals": analysis.has_animals,
                    "dimensions": dimensions
                }
                results.append(result)
                print(f"  ✓ Complete\n")
            
        except Exception as e:
            print(f"  ✗ Failed: {e}\n")
            continue
    
    # Save results
    save_manifest(results)
    
    print(f"\n{'='*70}")
    print(f"✓ Processed {len(results)}/{len(images)} images successfully!")
    print(f"{'='*70}\n")

def save_manifest(results: List[dict]):
    """Save manifest in JSON and Markdown formats"""
    output_dir = Path("/Users/peterdonaghey/Projects/vegan-hearts/.dev")
    
    # JSON manifest
    json_path = output_dir / "india-photos-manifest.json"
    with open(json_path, 'w') as f:
        json.dump({
            "total_images": len(results),
            "processed_date": "2026-01-06",
            "images": results
        }, f, indent=2)
    print(f"\n✓ JSON manifest: {json_path}")
    
    # Markdown catalog
    md_path = output_dir / "india-photos-catalog.md"
    with open(md_path, 'w') as f:
        f.write("# India Documentary Photos Catalog\n\n")
        f.write(f"**Total Images:** {len(results)}\n\n")
        f.write("---\n\n")
        
        for i, img in enumerate(results, 1):
            f.write(f"## {i}. {img['new_filename']}\n\n")
            f.write(f"**Original:** `{img['original_filename']}`\n\n")
            f.write(f"### Description\n{img['description']}\n\n")
            f.write(f"### Metadata\n")
            f.write(f"- **Alt Text:** {img['alt_text']}\n")
            f.write(f"- **Subject:** {img['primary_subject']}\n")
            f.write(f"- **Mood:** {img['mood']}\n")
            f.write(f"- **People:** {'Yes' if img['has_people'] else 'No'}\n")
            f.write(f"- **Animals:** {'Yes' if img['has_animals'] else 'No'}\n")
            f.write(f"- **Dimensions:** {img['dimensions']['width']}x{img['dimensions']['height']} ")
            f.write(f"({img['dimensions']['orientation']}, {img['dimensions']['megapixels']}MP)\n")
            f.write(f"- **Suggested Uses:** {', '.join(img['suggested_uses'])}\n\n")
            f.write(f"### S3 Location\n")
            f.write(f"```\n{img['s3_url']}\n```\n\n")
            f.write(f"![{img['alt_text']}]({img['s3_url']})\n\n")
            f.write("---\n\n")
    
    print(f"✓ Markdown catalog: {md_path}")

if __name__ == "__main__":
    process_all_images()

