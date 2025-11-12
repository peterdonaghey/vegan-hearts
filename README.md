# 🌱 VeganHearts

> Building a compassionate world through vegan education, community, and advocacy

## About

VeganHearts is an early-stage NGO creating digital infrastructure to support the vegan movement worldwide. Our mission is to:

- 📚 **Educate:** Share knowledge and resources about veganism
- 🤝 **Connect:** Build a global community of vegans and advocates  
- 🌍 **Advocate:** Support activism and animal sanctuaries

## Features

### Public-Facing
- 🏠 **Home & Education Pages** - Course information and resources
- 📅 **Events Listing** - Upcoming and past VeganHearts events with posters
- 📧 **Email Signup** - Newsletter subscription with welcome emails
- 📖 **Ebook Download** - "Awakening Your Vegan Heart" with automated delivery

### Admin Dashboard
- 🔐 **Secure Authentication** - AWS Cognito with JWT tokens
- 📊 **Events Management** - Create, edit, delete events with poster uploads
- 👥 **Subscriber Management** - Full control over mailing list
- 👤 **User Management** - Invite admins via email with secure password setup
- 🎨 **Clean UI** - Modern interface with VeganHearts branding

**Admin Access:** Click the footer logo 7 times to access login 🧙‍♂️

## Tech Stack

### Frontend
- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### Backend & Infrastructure
- **Hosting:** Vercel (serverless)
- **Database:** AWS DynamoDB (4 tables)
- **Storage:** AWS S3 (event posters, assets)
- **Auth:** AWS Cognito
- **Email:** AWS SES & SESv2 (transactional + mailing list)
- **Email Forwarding:** AWS WorkMail
- **IAM:** Dedicated user with scoped permissions

## Development

```bash
# Install dependencies
npm install

# Run development server (port 3001)
PORT=3001 npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

Visit [http://localhost:3001](http://localhost:3001) to see the site.

## Environment Variables

Required for development and production:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_CLIENT_ID=

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3001  # dev
NEXT_PUBLIC_APP_URL=https://yourdomain.com # prod
```

See `.dev/documentation/ENV-VARS.md` for details.

## Deployment

Deployed on Vercel with automatic deployments from `main` branch.

**Important:** Set `NEXT_PUBLIC_APP_URL` in Vercel environment variables before deploying:

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://yourdomain.com
```

## Infrastructure Setup

All AWS infrastructure scripts are in `.dev/scripts/` (numbered for execution order):

1. DynamoDB tables (email signups, events, admin users, password tokens)
2. S3 bucket for assets
3. Cognito user pool
4. SES email configuration
5. IAM user with scoped permissions

Run scripts with `--profile peterdonaghey` (or update to your AWS profile).

## Admin User Management

### Create First Admin
```bash
./.dev/scripts/14b_create_admin_user.sh
```

### Invite Additional Admins
Use the admin dashboard at `/admin/users` - users receive email invites to set their own passwords.

## Email System

- **Transactional Emails:** SES (welcome, ebook delivery, admin invites)
- **Mailing List:** SESv2 contact list
- **Forwarding:** WorkMail (hello@vegan-hearts.org, education@vegan-hearts.org)

## Documentation

Organized in `.dev/`:

- `/scripts/` - Infrastructure setup scripts
- `/documentation/` - Technical references
- `/docs/` - Project documentation
- `/completed/` - Historical milestones
- `PRE-PRODUCTION-CHECKLIST.md` - Deployment checklist
- `PRODUCTION-READY.md` - Final status

## Project Stats

- **Pages:** 20 (8 static, 8 dynamic, 4 API routes)
- **TypeScript Files:** 1,167
- **First Load JS:** 105KB (shared)
- **Build Time:** ~10 seconds

## Contributing

VeganHearts is volunteer-run. If you'd like to contribute, please reach out to the team.

## License

© 2025 VeganHearts. All rights reserved.

---

*For the animals. For the planet. For each other.* 🌿
