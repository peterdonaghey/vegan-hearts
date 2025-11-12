# Environment Variables Documentation

## Required Environment Variables

### Development
```bash
# App URL for password reset links
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Production
```bash
# App URL for password reset links
# Update this to match your production domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Setting in Vercel

```bash
# Add to Vercel environment variables
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://yourdomain.com

vercel env add NEXT_PUBLIC_APP_URL preview
# Enter: https://yourdomain.com (or preview domain)

vercel env add NEXT_PUBLIC_APP_URL development
# Enter: http://localhost:3001
```

## Usage

This variable is used in:
- `/app/api/admin-users/route.ts` - Password setup email links
- Password reset flows (future)

## Fallback

If not set, defaults to `http://localhost:3001` for development safety.

