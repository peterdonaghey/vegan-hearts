# Handoff: Implement News Feature for Vegan Hearts

hey there! you're taking over implementation of the news feature for the vegan hearts website. everything is scoped out and ready to go.

## project overview

**vegan hearts** is a non-profit organization website for awakening compassion through vegan education, events, and community. currently built with:
- next.js 15 (app router)
- typescript
- tailwind css
- aws dynamodb for data
- aws s3 for media
- aws cognito for admin auth

the team just got back from india filming a documentary and wants to add a news section to share updates about the project.

## github issue structure

**parent issue**: https://github.com/peterdonaghey/vegan-hearts/issues/2

this parent issue contains the complete plan and has **21 sub-issues** that break down all the implementation tasks. the sub-issues are already created and linked - you'll see them in the parent issue with a progress bar showing 0/21 completed.

## your workflow

### 1. start by reading the parent issue
- review the full plan in issue #2
- understand the architecture (reusable components, api structure, etc.)
- note the rich text editor requirements (paste/drag/drop images)
- understand the custom video player requirement (no external embeds)

### 2. work through sub-issues systematically
as you complete each sub-issue:
```bash
# mark as complete
gh issue close <issue-number> --repo peterdonaghey/vegan-hearts

# or if you prefer, add a comment first then close
gh issue comment <issue-number> --repo peterdonaghey/vegan-hearts --body "completed: [brief description of what was done]"
gh issue close <issue-number> --repo peterdonaghey/vegan-hearts
```

### 3. handle unexpected changes
when you need to pivot or encounter issues:

**add comments to the relevant sub-issue**:
```bash
gh issue comment <issue-number> --repo peterdonaghey/vegan-hearts --body "pivot: [description of change and why]"
```

**if the approach changes significantly**:
- update the issue description to reflect what you actually did
- comment explaining why the change was made
- keep the github issues as the source of truth

### 4. create additional sub-issues if needed
if you discover tasks that aren't covered:
```bash
# create new sub-issue
gh issue create --title "New task discovered: [description]" \
  --body "parent issue: #2\n\n[details]" \
  --assignee peterdonaghey \
  --repo peterdonaghey/vegan-hearts

# link it to parent (assuming new issue is #24)
cd /Users/peterdonaghey/Projects/vegan-hearts
gh sub-issue add 2 24
```

**important**: don't add the new sub-issue to the project board - it will show in the parent's progress bar automatically.

## key technical requirements

### rich text editor (critical)
- must support **paste** images (ctrl/cmd+v)
- must support **drag & drop** images
- must support **click to upload** images
- all methods upload immediately to s3 and insert url
- uses react-quill with custom config
- see issue #8 for details

### custom video player (critical)
- html5 `<video>` element, no external embeds (youtube, vimeo, etc.)
- custom styled controls matching site aesthetic
- see issue #9 for details

### reusable architecture (important)
- newscard, newslist components should be reusable with different variants
- this pattern will be used for events widget on homepage later
- avoid code duplication

### aws profile
when running aws commands, use:
```bash
aws --profile peterdonaghey [command]
```

### deployment
**DO NOT deploy to production** unless peter explicitly asks. after completing work, let peter test and decide when to deploy.

## project structure reference

```
app/
  api/
    news/
      route.ts                    # main crud
      [slug]/route.ts            # get single article
      upload-inline/route.ts     # inline image uploads
      upload-video/route.ts      # video uploads
  news/
    page.tsx                     # listing page
    [slug]/page.tsx              # article detail page
  admin/
    news/page.tsx                # admin management
  components/
    NewsCard.tsx                 # reusable card (compact/full)
    NewsList.tsx                 # reusable list
    NewsForm.tsx                 # admin form
    NewsArticle.tsx              # article renderer
    RichTextEditor.tsx           # quill wrapper
    VideoPlayer.tsx              # custom player
```

## testing as you go

after completing key milestones:
- test the feature in the browser
- verify mobile responsiveness
- ensure admin auth is required for management pages
- test the rich text editor (paste, drag, upload)
- test video player on mobile

## context about the documentary

the first news article will be about the **"vegan hearts in india"** documentary:
- team of 3: mirella, eveliina (organizers), santeri (filmmaker)
- mission: singing healing songs for animals, bringing food, rescuing animals in need
- filmed in india january 2026
- publishing later in 2026
- gofundme: https://gofund.me/8724c869d

eveliina will provide the content and peter has the photos/videos to upload.

## important notes

### fallback handling
**critical**: never use silent fallbacks for env vars or missing data. the app should crash loudly if required env vars are missing, not silently fail.

### email setup
the email forwarding (info@veganhearts.org) requires dns changes in spaceship domain provider (not route 53). you'll provide the ses dns records to peter and he'll add them.

### stock photo replacement
the current homepage has stock photos that need to be replaced with authentic team photos from india. maintain the spiritual, calm vibe - not startup-y.

## getting started

1. read parent issue #2 completely
2. read through all 21 sub-issues to understand the full scope
3. start with issue #3 (install packages)
4. work through systematically, marking progress as you go
5. comment on any pivots or unexpected findings
6. keep the github issues as the living documentation

## if you get stuck

- add a comment to the relevant issue explaining the blocker
- check the existing events implementation for patterns to follow
- the codebase already has working examples of s3 uploads, dynamodb crud, admin auth, etc.

## final reminder

**track everything in github issues**. the issues are the source of truth. if you do something differently than planned, update the issue. if you discover something, comment. keep peter in the loop through the issues.

good luck! the plan is solid and the codebase is well-structured. you've got this 💚

