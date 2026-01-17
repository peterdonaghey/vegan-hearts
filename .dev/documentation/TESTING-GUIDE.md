# Testing Guide - Events Management System

## 🔍 What's New

The homepage hasn't changed - the new features are on separate routes!

---

## 📍 New Routes

### 1. Public Events Page
**URL:** `http://localhost:3000/events`

**What you'll see (when empty):**
- Hero section with "Events" title
- "No upcoming events at the moment. Check back soon!"

**What you'll see (with events):**
- Location filter buttons (All / Online / Country)
- Upcoming Events section
- Past Events section
- Click any event card to see details in modal

---

### 2. Admin Dashboard
**URL:** `http://localhost:3000/admin/events`

**What happens:**
- You'll see a login screen
- BUT WAIT - you need to create an admin user first!

---

## 🚀 Step-by-Step Testing

### Step 1: Create Admin User

Run this script in your terminal:
```bash
cd /Users/peterdonaghey/Projects/vegan-hearts
./.dev/scripts/14b_create_admin_user.sh
```

**You'll be prompted for:**
- Email address (use your email)
- Temporary password (min 8 chars, with uppercase, lowercase, number)
  - Example: `TempPass123`

**Note:** You'll need to change this password on first login.

---

### Step 2: Login to Admin

1. Go to: `http://localhost:3000/admin/events`
2. Enter your email and temporary password
3. You'll be prompted to set a new password
4. Enter new password (same requirements)
5. You're in! 🎉

---

### Step 3: Create Your First Event

1. Click "Add New Event" button
2. Upload the "Gift of Compassion" poster (drag & drop or click)
3. Fill in the form:
   - **Title:** Gift of Compassion
   - **Description:** Free vegan tapas, singing & compassion circle, live music, film screening "A prayer for Compassion"
   - **Start Date/Time:** 2025-12-13 at 17:30
   - **End Time:** 2025-12-13 at 21:00
   - **Location:** La Fuente, c/ Pablo Picasso 1
   - **Country:** Spain
   - **Registration Method:** Reservations via WhatsApp: +34 711 08 78 89
4. Click "Create Event"

---

### Step 4: View on Public Page

1. Go to: `http://localhost:3000/events`
2. You should see your event in the "Upcoming Events" section!
3. Try the location filters
4. Click the event card to see details

---

## 🧪 Things to Test

### Admin Dashboard
- ✅ Create event with image upload
- ✅ Edit existing event
- ✅ Delete event (soft delete)
- ✅ Upload different image formats (JPG, PNG, WebP)
- ✅ Try uploading huge file (should fail at 10MB+)
- ✅ Try without filling required fields

### Public Page
- ✅ View upcoming events
- ✅ View past events (create event with date in past)
- ✅ Filter by location
- ✅ Filter by "Online" (create online event)
- ✅ Click event card for modal
- ✅ Click registration link

### Navigation
- ✅ Check that "Events" link appears between Home and Education
- ✅ Click between pages

---

## 🐛 If Something Breaks

**Check dev server console** - it will show errors there

**Common issues:**
- "Unauthorized" → Check AWS credentials in .env.local
- "Failed to upload" → Check S3 permissions
- Login doesn't work → Check Cognito env vars
- No events showing → Check DynamoDB has items

---

## 📊 Quick Stats

**AWS Resources Created:**
- DynamoDB table: `vegan-hearts-events`
- S3 bucket: `vegan-hearts-assets`  
- Cognito pool: `vegan-hearts-admins`

**Backend APIs:**
- `/api/events` (GET, POST, PUT, DELETE)
- `/api/events/upload` (POST)

**Frontend Pages:**
- `/events` (public)
- `/admin/events` (protected)

---

Ready to test! Start with creating the admin user. 🚀

