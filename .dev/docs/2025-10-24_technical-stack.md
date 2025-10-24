# VeganHearts Technical Stack Documentation

**Date:** October 24, 2025  
**Status:** Phase 1 - Foundation  
**Developer:** Peter Donaghey

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4.1
- **Icons:** Lucide React 0.263.1
- **Utilities:** clsx, tailwind-merge

### Infrastructure (AWS)
- **Domain:** AWS Route 53 (vegan-hearts.org)
- **Hosting:** AWS Amplify
- **Future:** AWS SES (email), DynamoDB (storage)

### Development
- **Node.js:** v22.20.0
- **Package Manager:** npm 10.9.3
- **Runtime:** Managed via nvm

---

## Color Palette

Custom earthy, nature-inspired colors:

```typescript
colors: {
  'earth-brown': '#8B7355',
  'forest-green': '#2D5016',
  'leaf-green': '#7CB342',
  'warm-cream': '#F5F1E8',
  'sunset-orange': '#FF7043',
}
```

---

## Project Structure

```
/Users/peterdonaghey/Projects/vegan-hearts/
├── .dev/
│   └── docs/                    # Project documentation
├── app/
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles + Tailwind
├── lib/
│   └── utils.ts                 # Utility functions
├── components/                  # Future: Reusable components
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config with custom theme
└── next.config.js               # Next.js config
```

---

## Domain Registration

### Command
```bash
aws route53domains register-domain \
  --region us-east-1 \
  --domain-name vegan-hearts.org \
  --duration-in-years 1 \
  --admin-contact file://contact.json \
  --registrant-contact file://contact.json \
  --tech-contact file://contact.json \
  --auto-renew
```

### Status
- ✅ Domain available: vegan-hearts.org
- ⏳ Registration pending

---

## AWS Amplify Deployment

### Setup Commands

```bash
# Initialize Amplify app
npm install -g @aws-amplify/cli
amplify init

# Configure build settings
# Next.js is auto-detected

# Deploy
amplify publish
```

### Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 22
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## Development Workflow

### Local Development
```bash
npm run dev     # Start dev server on localhost:3000
npm run build   # Build for production
npm run start   # Start production server locally
npm run lint    # Run ESLint
```

### Git Workflow
```bash
git add .
git commit -m "Description"
git push origin main
# Amplify auto-deploys on push to main
```

---

## Environment Variables

### Required for Production
```bash
# Future: Email service
NEXT_PUBLIC_AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=hello@vegan-hearts.org

# Future: Database
DYNAMODB_TABLE_EMAILS=vegan-hearts-emails
```

---

## Landing Page Features

### Current Implementation
✅ Hero section with mission statement  
✅ Email signup form (UI only - placeholder)  
✅ Featured course highlight  
✅ Three mission pillars (Education, Community, Advocacy)  
✅ Coming soon features grid  
✅ Footer with branding  
✅ Responsive design (mobile-first)  
✅ Smooth animations and transitions  
✅ Accessible markup (semantic HTML, ARIA)

### Next Steps
- [ ] Wire email signup to AWS SES + DynamoDB
- [ ] Add form validation
- [ ] Set up automated welcome emails
- [ ] Add analytics (Plausible or similar)
- [ ] Add social media links when available
- [ ] Create 404 and error pages
- [ ] Add loading states

---

## Performance Considerations

### Implemented
- Server-side rendering (SSR) via Next.js App Router
- Automatic code splitting
- Image optimization ready (Next.js Image component)
- Font optimization (Next.js Font loader with Inter)
- Tailwind CSS purging (automatic in production)

### Future Optimizations
- Add Plausible or Fathom analytics (privacy-focused)
- Implement service worker for offline support
- Add prefetching for internal navigation
- Optimize for Core Web Vitals

---

## Security Considerations

### Current
✅ HTTPS enforced by default (Amplify)  
✅ TypeScript for type safety  
✅ Next.js security headers (automatic)

### Future
- [ ] Add rate limiting for forms
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Set up AWS WAF rules
- [ ] Regular dependency updates
- [ ] Security audit before public launch

---

## Accessibility (WCAG 2.1 AA)

### Implemented
✅ Semantic HTML5 elements  
✅ Proper heading hierarchy  
✅ Sufficient color contrast  
✅ Keyboard navigation support  
✅ Responsive text sizing  
✅ Screen reader friendly  

### To Test
- [ ] Automated accessibility audit (Lighthouse)
- [ ] Manual screen reader testing
- [ ] Keyboard-only navigation testing
- [ ] Mobile accessibility testing

---

## Monitoring & Analytics

### Future Setup
- Vercel Analytics or Plausible (privacy-focused)
- AWS CloudWatch for infrastructure
- Error tracking (Sentry or similar)
- Uptime monitoring
- Performance monitoring (Core Web Vitals)

---

## Backup & Recovery

### Strategy
- Git repository as source of truth
- Amplify maintains deployment history
- Database backups (future: DynamoDB point-in-time recovery)
- Regular exports of user data
- Documented recovery procedures

---

## Cost Estimates (AWS)

### Phase 1 (Current)
- **Route 53 Domain:** ~$12/year
- **Amplify Hosting:** Free tier (5GB storage, 15GB served/month)
- **Total:** ~$1/month

### Phase 2 (With Backend)
- Domain: $1/month
- Amplify: $5-10/month
- DynamoDB: $1-5/month (on-demand)
- SES: $0.10/1000 emails
- **Total:** ~$10-20/month

---

## Contact & Support

**Developer:** Peter Donaghey  
**Organization:** VeganHearts NGO  
**Repository:** TBD (GitHub)  
**Production URL:** TBD (vegan-hearts.org)  
**Dev URL:** http://localhost:3000

---

*Last Updated: October 24, 2025*

