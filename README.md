# 🌱 VeganHearts

> Building a compassionate world through vegan education, community, and advocacy

## About

VeganHearts is an early-stage NGO creating digital infrastructure to support the vegan movement worldwide. Our mission is to:

- 📚 **Educate:** Share knowledge and resources about veganism
- 🤝 **Connect:** Build a global community of vegans and advocates  
- 🌍 **Advocate:** Support activism and animal sanctuaries

## Featured Course

**Opening Your Vegan Heart in 21 Days** - A transformative journey toward compassionate living.

## Tech Stack

- **Framework:** Next.js 15 (React, TypeScript)
- **Styling:** Tailwind CSS
- **Hosting:** AWS Amplify
- **Domain:** AWS Route 53

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Deployment

Hosted on AWS Amplify with automatic deployments from the `main` branch.

**Production URL:** https://vegan-hearts.org

## Email Forwarding

To set up or update email forwarding (e.g., `education@vegan-hearts.org` → your personal email):

```bash
.dev/scripts/setup-email-forwarding.sh <forward-to-email> [<source-email>]
```

Examples:
```bash
# Forward education@ to your email
.dev/scripts/setup-email-forwarding.sh donagheypeter@googlemail.com education@vegan-hearts.org

# Forward ALL @vegan-hearts.org emails
.dev/scripts/setup-email-forwarding.sh donagheypeter@googlemail.com
```

The script handles everything via AWS CLI:
- Verifies recipient email in SES
- Creates Lambda forwarder function
- Sets up SES receipt rules
- Configures MX records in Route 53

**Note:** You'll need to verify the recipient email (check inbox for AWS verification link).

## Documentation

See `.dev/docs/` for:
- Technical stack details
- Deployment guide
- Project context and handoff

## Contributing

VeganHearts is volunteer-run. If you'd like to contribute, please reach out to the team.

## License

© 2025 VeganHearts. All rights reserved.

---

*For the animals. For the planet. For each other.* 🌿

