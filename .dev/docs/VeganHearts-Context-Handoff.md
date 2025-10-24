# VeganHearts Project - Complete Context & Research Handoff

**Date Created:** October 24, 2025  
**Purpose:** Context document for VeganHearts web platform development  
**Mission:** Building digital infrastructure for VeganHearts NGO to support vegan education, community building, and animal advocacy

---

## Project Background

VeganHearts is an early-stage NGO focused on:
- Vegan education and information dissemination
- Community building and networking
- Animal advocacy and activism
- Supporting the transition to veganism

**Key Course:** "Opening Your Vegan Heart in 21 Days" (ebook & facilitator course)

**Current Stage:** Pre-funding, volunteer-based, collecting hours for future payment

---

## Domain Availability Research (October 24, 2025)

### UNAVAILABLE
- ❌ `veganhearts.org`
- ❌ `veganhearts.com`

### AVAILABLE - Primary Recommendations
- ✅ `vegan-hearts.org` - **RECOMMENDED PRIMARY** (nonprofit standard, memorable)
- ✅ `openyourveganheart.org` - Directly connects to 21-day course brand
- ✅ `vegan-hearts.com` - Good alternative/redirect

### AVAILABLE - Additional Options
- ✅ `theveganhearts.org`
- ✅ `theveganhearts.com`
- ✅ `veganheart.org` (singular)
- ✅ `veganhearts.co`
- ✅ `veganhearts.io`
- ✅ `veganhearts.world`

**Strategy:** Secure `vegan-hearts.org` as primary, consider `openyourveganheart.org` for course-specific platform

---

## Planned Features (from Mirella's document)

### Core Features
1. Mission, Vision, Values section
2. Education platform (ebook & facilitator course)
3. Online course: "Opening Your Vegan Heart in 21 Days"
4. Volunteer management system
5. Membership system
6. Project showcases
7. Art gallery
8. Member/educator/volunteer profiles + chat
9. Events & retreats management
10. Activism coordination
11. Articles/columns (blog)
12. Webshop
13. Communities & sanctuaries directory
14. Recipe bank
15. Library (resources)
16. Partners section
17. Vegan network hub (directory of vegan businesses/entrepreneurs/organizations globally)
18. Donation page
19. Application system

---

## Research: Successful Vegan Organizations & Features

### Community Platforms
- **VeganProfile** - Social network with profiles, chat, groups, feed
- **Connect For Animals** - Free platform to reduce vegan recidivism, increase connection
- **Vegan Street** - Essays, interviews, memes, recipes, guides

### Education & Course Platforms
- **Brownble** (brownbleprograms.com) - "The Roadmap" comprehensive vegan lifestyle course
- **Veecoco** (veecoco.com) - International vegan cooking school, 23+ courses, 400+ lessons
- **Rouxbe** - Plant-Based Pro Certification, professional culinary education
- **Pachavega** - Raw food chef certification + holistic wellness
- **The Vegan Chef School** - Vocational courses for professional vegan chefs
- **Forks Over Knives** - Course platform with meal planning, cooking methods

### Successful Organizations to Learn From
- **The Vegan Society** (vegansociety.com) - Educational charity, advocacy service
- **North American Vegetarian Society (NAVS)** - Events, literature, Vegan Summerfest conference
- **Vegan Outreach** - Founded 1993, distributes booklets promoting plant-based eating
- **Mercy For Animals** - Undercover investigations, advocacy
- **Animal Outlook** - Corporate and government advocacy
- **VegFund** - Provides grants to vegan activists worldwide
- **Afro-Vegan Society** - Resources for marginalized communities (7-Day Meal Planner, guides)

### Key Features Observed
- **Membership tiers** with benefits
- **Certificate programs** for credibility
- **Grant programs** to support activists
- **Event management** (VegFests, conferences)
- **Resource libraries** (recipes, guides, videos)
- **Community forums** and discussion boards
- **Volunteer hour tracking**
- **Business directories**
- **Newsletter systems**
- **Donation processing**

---

## Technical Architecture Recommendations

### Phase 1 - Foundation (Immediate - Week 1-2)
**Goal:** Establish online presence and start building community

**Technical Stack Suggestions:**
- **Frontend:** Next.js 14+ (React framework with SSR/SSG)
- **Styling:** Tailwind CSS (rapid development, modern design)
- **Hosting:** Vercel (free tier, excellent Next.js integration) or AWS Amplify
- **Domain:** AWS Route 53 (already using AWS)
- **Email Capture:** Mailchimp or ConvertKit free tier

**Deliverables:**
- Landing page with mission/vision
- Email signup form
- "Coming Soon" feature teasers
- Social media links
- Contact information
- Beautiful, modern, responsive design

### Phase 2 - Core Platform (3-6 months)
**Goal:** Launch member area and first educational content

**Additional Tech:**
- **Authentication:** Supabase Auth or NextAuth.js
- **Database:** Supabase (PostgreSQL) or PlanetScale (MySQL)
- **CMS:** Sanity.io or Contentful for content management
- **File Storage:** AWS S3 or Supabase Storage
- **Payments:** Stripe (donations, memberships, courses)
- **Email Service:** SendGrid or Amazon SES

**Deliverables:**
- User registration and profiles
- Course platform (video hosting via Vimeo or Mux)
- Recipe/article system
- Donation integration
- Newsletter system
- Admin dashboard

### Phase 3 - Community Features (6-12 months)
**Goal:** Build active community engagement

**Additional Tech:**
- **Real-time Chat:** Supabase Realtime or Socket.io
- **Forum:** Discourse integration or custom build
- **Event Management:** Custom + calendar integrations
- **Search:** Algolia or MeiliSearch

**Deliverables:**
- Member messaging/chat
- Discussion forums
- Event calendar and registration
- Volunteer hour tracking
- Business directory with search
- Advanced member profiles

### Phase 4 - Advanced (12+ months)
**Goal:** Full-featured platform with revenue streams

**Additional Tech:**
- **E-commerce:** Shopify integration or Snipcart
- **Mobile:** React Native or Progressive Web App
- **Analytics:** Plausible or Fathom (privacy-focused)
- **Internationalization:** next-i18next

**Deliverables:**
- Full webshop
- Art gallery with submissions
- Mobile app
- Multi-language support
- Advanced matchmaking algorithms
- API for third-party integrations

---

## Best Practices for Nonprofit Tech

### Accessibility
- WCAG 2.1 AA compliance minimum
- Semantic HTML
- Keyboard navigation
- Screen reader compatibility
- Color contrast standards

### Privacy & Compliance
- GDPR compliance (EU visitors)
- Clear privacy policy
- Cookie consent management
- Data deletion requests handling
- Transparent data usage

### Performance
- Image optimization (WebP, lazy loading)
- Core Web Vitals optimization
- Mobile-first design
- Fast page loads (< 3 seconds)

### SEO Strategy
- Blog/article content strategy
- Recipe schema markup
- Local business schema for directory
- Backlink strategy (partnerships)
- Social media integration

### Security
- HTTPS everywhere (SSL)
- Regular security updates
- Input sanitization
- Rate limiting on forms
- Regular backups

---

## Partnership & Collaboration Opportunities

### Organizations to Connect With
- The Vegan Society
- Vegan Outreach
- VegFund (grant opportunities)
- Local VegFests
- Animal sanctuaries
- Vegan business networks
- Plant-based nutrition organizations

### Collaboration Ideas
- Cross-promote events
- Share educational resources
- Joint grant applications
- Guest content exchange
- Volunteer network sharing
- Referral partnerships

---

## Revenue Model Ideas

### Primary Sources
1. **Donations** (one-time and recurring)
2. **Membership tiers** (basic free, premium paid)
3. **Course sales** (21-day program, additional courses)
4. **Corporate training** (businesses wanting to add vegan options)
5. **Certification programs** (vegan coach, facilitator)

### Secondary Sources
6. **Webshop** (merchandise, partner products)
7. **Affiliate revenue** (vegan product recommendations)
8. **Sponsored directory listings** (businesses)
9. **Event ticket sales** (retreats, workshops)
10. **Grant funding** (foundations, environmental grants)

---

## Out-of-the-Box Ideas

### Unique Features
- **AI Vegan Transition Coach** - Personalized support using AI
- **Mentor Matching System** - Pair experienced vegans with newcomers
- **Recipe Translation Hub** - Make vegan cooking accessible in any language
- **Sanctuary Direct Connect** - Link supporters directly to animal sanctuaries
- **Local Chapter Framework** - Template for starting regional VeganHearts chapters
- **Corporate Vegan Consultancy** - B2B service helping businesses go vegan
- **Vegan Professional Network** - LinkedIn-style for vegan entrepreneurs

### Innovative Tech
- **Mobile app with meal planning** and shopping lists
- **AR Recipe Instructions** - Step-by-step in your kitchen
- **Vegan Restaurant Finder** - Like HappyCow but integrated with community
- **Carbon Impact Calculator** - Show environmental impact of vegan choices
- **Challenge Platform** - Gamified 21-day challenges with community support

---

## Strategic Questions to Clarify

### Organizational
1. Core leadership team and roles?
2. Funding timeline and applications?
3. Legal nonprofit entity status?

### Vision
4. Top 3 priorities for year one?
5. Primary target audience?
6. Unique differentiation from other orgs?

### Technical
7. Other team members' skills (design, content, marketing)?
8. Content creation plan?
9. Existing partnerships?
10. Volunteer management structure?

### Immediate
11. Branding package (logo, colors, fonts)?
12. Realistic 3-6 month launch scope?

---

## Developer Notes

### Peter's Role
- 10 years vegan
- 5 years professional coding (Point Topic - broadband datasets)
- Full-time employed, volunteering hours
- Wants strategic involvement beyond just coding
- Passionate about animal liberation

### Development Approach
- Start simple, iterate based on feedback
- Mobile-first, accessibility-first
- Document everything from day one
- Use modern, maintainable tech stack
- Focus on user experience
- Build for scale but launch lean

### Key Principles
- **Collaboration over competition** - Other vegan orgs are allies, not competitors
- **Mission-first** - Every decision should serve the animals
- **Inclusive** - Accessible to everyone, everywhere
- **Sustainable** - Build for long-term maintenance
- **Transparent** - Open about progress, challenges, decisions

---

## Resources & Links

### Research Sources
- World of Vegan (vegan nonprofit directory)
- VeganLinked (organization archive)
- Vegan Activism (comprehensive org list)
- Happy Cow (vegan resources)
- American Vegan Society (vegan synergy partnerships)

### Technical Inspiration
- Forks Over Knives (course platform)
- VeganProfile (social network)
- The Vegan Society (established org)
- Veecoco (cooking courses)
- Connect For Animals (community platform)

---

## Next Steps (Post-Meeting)

1. ✅ Secure `vegan-hearts.org` domain
2. 🚀 Set up Next.js boilerplate project
3. 🎨 Create landing page with mission/vision
4. 📧 Implement email capture
5. 🚀 Deploy to production (Vercel/AWS)
6. 📱 Add social media links (when available)
7. 📝 Document technical decisions
8. 🔄 Set up GitHub repository
9. 📊 Establish project management (GitHub Projects/Trello)
10. 🎯 Define Phase 1 completion criteria

---

## Meeting Preparation Summary

**Your Pitch:**
"I've been vegan for 10 years and coding professionally for 5 years. This is the perfect intersection of my skills and values. I've researched similar organizations, checked domain availability, and I'm ready to start building. I'm committed not just as a developer but as someone who wants to help VeganHearts succeed in its mission to help animals and build a vegan world. I can have a landing page live within 48 hours if we align on priorities."

**Your Ask:**
- Clarity on leadership structure
- Top 3 priorities for year one
- Realistic timeline expectations
- Involvement in strategic decisions
- Branding materials if available

**Your Offer:**
- Web development expertise
- Strategic thinking and planning
- Long-term commitment
- Professional experience building data platforms
- Passion for the mission

---

**Remember:** This is about collaboration, not competition. Every organization working toward a vegan world is part of the same movement. We learn from each other, share resources, and support the mission together. 🌱

---

*This document should be copied to the VeganHearts project repository for reference by future developers and team members.*

