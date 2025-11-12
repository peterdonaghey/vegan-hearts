# VeganHearts Events System - Deployment Guide

**Date:** November 11, 2025  
**Status:** Complete - Ready for Testing

---

## ✅ What's Been Built

### AWS Infrastructure
- ✅ **DynamoDB Table:** `vegan-hearts-events` (with DateIndex GSI)
- ✅ **S3 Bucket:** `vegan-hearts-assets` (for event posters)
- ✅ **Cognito User Pool:** `vegan-hearts-admins` (for admin auth)
- ✅ **IAM Permissions:** Extended for events, S3, and Cognito

### Backend APIs
- ✅ `/api/events` - GET (public), POST/PUT/DELETE (admin only)
- ✅ `/api/events/upload` - POST (admin only) for image uploads
- ✅ Cognito JWT authentication middleware

### Frontend Pages
- ✅ `/events` - Public events page with upcoming/past sections
- ✅ `/admin/events` - Protected admin dashboard
- ✅ Location filter dropdown (All / Country / Online)
- ✅ Event cards with poster display
- ✅ Navigation updated with Events link

### Components
- ✅ `EventCard` - Display event poster and details
- ✅ `EventForm` - Add/edit events with image upload
- ✅ `AdminLayout` - Cognito authentication wrapper
- ✅ `LocationFilter` - Country/online filter dropdown

---

## 🔑 Environment Variables Required

Add these to Vercel (already have AWS credentials, need to add Cognito):

```bash
# Already in Vercel:
AWS_ACCESS_KEY_ID=<existing>
AWS_SECRET_ACCESS_KEY=<existing>
AWS_REGION=us-east-1

# ADD THESE NEW ONES:
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_Us0AwdnIH
NEXT_PUBLIC_COGNITO_CLIENT_ID=710osr70m6arhlp3jsrbaqbtpr
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

**To add to Vercel:**
```bash
vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID
# Paste: us-east-1_Us0AwdnIH
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID
# Paste: 710osr70m6arhlp3jsrbaqbtpr
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_COGNITO_REGION
# Paste: us-east-1
# Select: Production, Preview, Development
```

---

## 👤 Create Admin User

Run this script to create the first admin user:

```bash
./.dev/scripts/14b_create_admin_user.sh
```

It will prompt for:
- Admin email address
- Temporary password (min 8 chars, uppercase, lowercase, number)

**Important:** User will be forced to change password on first login.

---

## 🚀 Deployment Steps

1. **Add Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID
   vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID
   vercel env add NEXT_PUBLIC_COGNITO_REGION
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   # or
   git push origin main
   ```

3. **Create Admin User:**
   ```bash
   ./.dev/scripts/14b_create_admin_user.sh
   ```

4. **Test:**
   - Visit `https://vegan-hearts.org/events` (should show empty state)
   - Visit `https://vegan-hearts.org/admin/events` (should show login)
   - Login with admin credentials
   - Create first event

---

## 📝 How to Use the Admin Dashboard

1. **Login:** Go to `/admin/events`, enter your email and password
2. **First Login:** You'll be prompted to change your temporary password
3. **Create Event:**
   - Click "Add New Event"
   - Upload poster image (max 10MB, JPEG/PNG/WebP)
   - Fill in event details
   - Set date/time, location (or mark as online)
   - Add registration URL or method
   - Click "Create Event"
4. **Edit Event:** Click "Edit" on any event card
5. **Delete Event:** Click "Delete" (soft delete - sets isActive to false)

---

## 🎨 Event Display

**Public Page Features:**
- Upcoming events (chronological order)
- Past events (reverse chronological)
- Location filter (All / Online / by Country)
- Click event card to see details (currently just shows card)
- Registration links open in new tab

**Event Card Shows:**
- Event poster image
- Title
- Date and time (formatted DD/MM/YY • HH:MM)
- Location (city, country or "Online")
- Description (if provided)
- Registration button/info (if provided)

---

## 📊 Database Schema

**Table:** `vegan-hearts-events`

| Field | Type | Description |
|-------|------|-------------|
| eventId | String (PK) | UUID |
| title | String | Event title |
| description | String | Event description |
| date | String | ISO timestamp |
| endTime | String | ISO timestamp (optional) |
| location | String | City/venue name |
| country | String | Country name (optional) |
| isOnline | Boolean | Online event flag |
| posterUrl | String | S3 URL |
| registrationUrl | String | External link (optional) |
| registrationMethod | String | Alternative method (optional) |
| isActive | String | 'true' or 'false' (for GSI) |
| createdAt | String | ISO timestamp |
| updatedAt | String | ISO timestamp |

**GSI:** DateIndex (isActive + date) for efficient sorting

---

## 🔒 Security Features

- **Authentication:** AWS Cognito with JWT tokens
- **API Protection:** All POST/PUT/DELETE routes require valid token
- **Image Validation:** File type and size checks on upload
- **Soft Deletes:** Events are never hard-deleted
- **CORS:** Configured for vegan-hearts.org and localhost

---

## 💰 Cost Estimate

| Service | Usage | Cost |
|---------|-------|------|
| DynamoDB | Free tier (25 RCU/WCU) | $0/month |
| S3 | First 5GB free | $0/month |
| Cognito | 50,000 MAUs free | $0/month |
| **Total** | | **$0/month** |

---

## 🧪 Testing Checklist

### Public Page:
- [ ] `/events` loads without errors
- [ ] Shows "No upcoming events" when empty
- [ ] Location filter appears
- [ ] Navigation includes Events link

### Admin Dashboard:
- [ ] `/admin/events` shows login form
- [ ] Login with valid credentials works
- [ ] Invalid credentials show error
- [ ] Password change flow works
- [ ] Dashboard shows "Create Your First Event" when empty

### Event Creation:
- [ ] Image upload works (tries all formats: JPG, PNG, WebP)
- [ ] Form validation works (required fields)
- [ ] Date/time picker works
- [ ] Online checkbox hides location fields
- [ ] Event appears in dashboard after creation
- [ ] Event appears on public page
- [ ] Registration URL works

### Event Management:
- [ ] Edit event loads existing data
- [ ] Update event saves changes
- [ ] Delete event removes from public view
- [ ] Past events appear in "Past Events" section

---

## 🐛 Troubleshooting

**Login not working:**
- Check Cognito user was created: `aws cognito-idp list-users --user-pool-id us-east-1_Us0AwdnIH --profile peterdonaghey`
- Check environment variables in Vercel
- Check browser console for JWT errors

**Image upload failing:**
- Check S3 bucket permissions
- Check file size (max 10MB)
- Check file type (JPEG, PNG, WebP only)
- Check CORS configuration

**Events not appearing:**
- Check DynamoDB table has items: `aws dynamodb scan --table-name vegan-hearts-events --profile peterdonaghey`
- Check `isActive` field is 'true'
- Check date format is ISO 8601

**API errors:**
- Check Vercel function logs: `vercel logs vegan-hearts.org`
- Check AWS credentials in Vercel
- Check IAM permissions were updated

---

## 📧 Response to Evelina

The email response has been saved to: `.dev/evelina-response.txt`

Content:
```
hey evelina,

great idea.. absolutely we can build that out..

**what we'll create**:
- events page showing the poster and key details
- upcoming events and past events sections  
- location filter dropdown (spain, online, etc)
- admin area where you can add/edit events and upload posters

**quick question**:
- when someone clicks an event, what should happen? just show a bigger version of the poster, or should we add extra info like full description, how to register, etc?

we'll get started..

~ peter
```

---

## 🎯 Next Steps

1. **Deploy & Test:** Add env vars, deploy, test login
2. **Create Admin User:** Run script to create Evelina's account
3. **Send Response:** Copy email from `.dev/evelina-response.txt`
4. **Wait for Feedback:** Get answer about event click behavior
5. **Add First Event:** Help Evelina add the "Gift of Compassion" event

---

## 📚 Scripts Created

All executable scripts in `.dev/scripts/`:
- `12_create_events_table.sh` - ✅ Executed
- `13_create_s3_bucket.sh` - ✅ Executed
- `14_setup_cognito.sh` - ✅ Executed
- `14b_create_admin_user.sh` - Ready to run
- `15_update_iam_permissions.sh` - ✅ Executed

---

**Status:** 🎉 Complete! Ready for deployment and testing.

