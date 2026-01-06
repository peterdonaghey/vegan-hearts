# homepage india photos replacement - complete

**date**: 2026-01-06
**issue**: #23
**status**: ✅ complete

## what was done

replaced 7/10 homepage stock photos with authentic india documentary images:

### replaced images

1. **hero background**: `india-2026-01-03-at-12.31.16.jpg`
   - mystical moss-covered forest trail
   - majestic mood, perfect for spiritual journey metaphor

2. **vision background**: `india-2026-01-03-at-13.16.40.jpg`
   - serene mountain landscape with pine forests

3. **mission - food projects**: `india-2026-01-03-at-13.16.19.jpg`
   - red berries with mountain backdrop

4. **mission - events**: `india-2026-01-03-at-13.16.47.jpg`
   - dramatic cave opening to ocean at sunset

5. **mission - wellness**: `india-2026-01-03-at-13.16.38.jpg`
   - peaceful pond with reflections

6. **mission - advocacy**: `india-2026-01-03-at-12.31.14.jpg`
   - playful brown dog in green meadow

7. **values - compassion**: `india-2026-01-03-at-13.16.52.jpg`
   - vibrant pink lotus flower (spiritual symbolism >> generic horse eye)

### kept stock (3/10)

- community banner: needs diverse people hands
- values - authenticity: needs person being authentic
- values - joy: needs people gathering

awaiting team/people photos from india trip.

## technical changes

- updated `app/main/page.tsx`: 7 image urls changed to s3
- updated `next.config.js`: added `/india-documentary/**` to remotePatterns
- all alt text uses ai-generated descriptions from manifest
- build tested: ✅ successful

## outcome

- homepage now **70% authentic** india documentary photography
- stronger mission/values storytelling
- spiritual/natural aesthetic maintained
- remaining 30% ready for team photos when available

## cleanup

- deleted `temp_pics/` folder (35 processed images)
- images permanently stored in s3
- metadata available in `.dev/india-photos-manifest.json`

## next

only 1 issue remaining: #20 (documentary announcement article)
news feature: **20/21 complete (95%)**

