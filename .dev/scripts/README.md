# VeganHearts Infrastructure Scripts

All infrastructure setup commands, logged for transparency and reproducibility.

## Scripts

### 01_create_github_repo.sh
Creates GitHub repository under peterdonaghey account and pushes initial code.

**Status:** ✅ Complete

```bash
./01_create_github_repo.sh
```

**Result:** https://github.com/peterdonaghey/vegan-hearts

---

### 02_deploy_amplify.sh
Deploys app to AWS Amplify and connects to GitHub for CI/CD.

**Prerequisites:**
- GitHub token with `repo` scope
- Get from: https://github.com/settings/tokens

**Option 1 - CLI (requires token):**
```bash
export GITHUB_TOKEN=your_token_here
./02_deploy_amplify.sh
```

**Option 2 - Console (recommended for first time):**
1. Go to: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Select "GitHub" and authorize
4. Select repo: `peterdonaghey/vegan-hearts`
5. Branch: `main`
6. Amplify auto-detects Next.js
7. Click "Save and deploy"

---

### 03_connect_domain.sh
Connects vegan-hearts.org custom domain to Amplify app.

**Prerequisites:**
- Amplify app created (02_deploy_amplify.sh)
- Domain registered (done ✅)

```bash
./03_connect_domain.sh
```

**Or via Console:**
1. Go to Amplify app
2. Click "Domain management"
3. Click "Add domain"
4. Enter: `vegan-hearts.org`
5. AWS handles DNS automatically

---

## Infrastructure State

**Domain:**
- ✅ vegan-hearts.org registered
- Status: In progress (~15 min)
- Operation ID: 9b4a002b-1786-4f60-9d1f-1368fc2599e5

**GitHub:**
- ✅ Repository created
- URL: https://github.com/peterdonaghey/vegan-hearts
- Branch: main
- Code pushed: ✅

**Amplify:**
- ⏳ Pending deployment
- Recommended: Use AWS Console for first-time setup

---

## Quick Start

**Fastest way to deploy:**

1. Visit https://console.aws.amazon.com/amplify/
2. New app → GitHub → peterdonaghey/vegan-hearts
3. Deploy automatically
4. Add domain: vegan-hearts.org
5. Done! ✨

**Total time:** ~20 minutes
- Deploy: 5 min
- Domain setup: 15 min

---

## AWS Profile

All scripts use `--profile peterdonaghey` to ensure correct AWS account.

## Cost

**Current setup:**
- Domain: $12/year (charged ✅)
- Amplify: Free tier (5GB storage, 15GB bandwidth)
- Total: ~$1.50/month

---

*Last updated: 2025-10-24 12:52*

