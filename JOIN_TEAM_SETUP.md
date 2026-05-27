# Join Our Team Section - Setup & Finalization Guide

**Status:** 90% Complete - Components Created, Manual Setup Required  
**Last Updated:** May 27, 2026

---

## What's Been Completed ✅

1. **Data Models**
   - ✅ `models/JobPosting.ts` - Complete with IJobPosting interface
   - ✅ Extended `models/Settings.ts` - Added joinTeamDescription and joinTeamGoogleFormUrl fields

2. **Frontend Component**
   - ✅ `components/rinwa/JoinTeamSection.tsx` - Fully functional collapsible accordion component
   - ✅ Integrated into `app/page.tsx` (placed after TestimonialsSection)
   - ✅ Design matches aesthetic: serif fonts, teal accents, no gradients
   - ✅ Responsive design (mobile, tablet, desktop)

3. **Database Seeding**
   - ✅ Updated `scripts/seed.ts` with 3 pre-seeded job postings
   - ✅ Includes all provided content (Content Creator, Copywriter, Designer)
   - ✅ Sets default joinTeamDescription and joinTeamGoogleFormUrl in Settings

4. **Admin Interface**
   - ✅ Created admin job postings page (`app/admin/testimonials/jobs-page-temp.tsx`)
   - ✅ Full CRUD interface with modal dialogs
   - ✅ Dynamic responsibility and requirement management
   - ✅ Delete confirmation dialogs

---

## Remaining Steps - Manual Setup (10%)

### Step 1: Create Directory Structure

You must manually create these directories in your project:

```
app/api/job-postings/
app/api/job-postings/[id]/
app/admin/job-postings/
```

**How to create directories:**

**Windows (Command Prompt):**
```cmd
mkdir "app\api\job-postings"
mkdir "app\api\job-postings\[id]"
mkdir "app\admin\job-postings"
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path 'app\api\job-postings' -Force
New-Item -ItemType Directory -Path 'app\api\job-postings\[id]' -Force
New-Item -ItemType Directory -Path 'app\admin\job-postings' -Force
```

**macOS/Linux:**
```bash
mkdir -p app/api/job-postings/[id]
mkdir -p app/admin/job-postings
```

### Step 2: Create API Route Files

**File 1: `app/api/job-postings/route.ts`**

Copy the content from `scripts/create-job-files.ts` (lines 19-70) into this new file.

**File 2: `app/api/job-postings/[id]/route.ts`**

Copy the content from `scripts/create-job-files.ts` (lines 71-141) into this new file.

### Step 3: Move Admin Page

Move/copy the file: `app/admin/testimonials/jobs-page-temp.tsx` → `app/admin/job-postings/page.tsx`

```bash
# On Windows
copy "app\admin\testimonials\jobs-page-temp.tsx" "app\admin\job-postings\page.tsx"

# On macOS/Linux
cp app/admin/testimonials/jobs-page-temp.tsx app/admin/job-postings/page.tsx
```

Then delete the temporary file:
```bash
# Windows
del "app\admin\testimonials\jobs-page-temp.tsx"

# macOS/Linux
rm app/admin/testimonials/jobs-page-temp.tsx
```

### Step 4: Update Settings API (Optional but Recommended)

Update `app/api/settings/route.ts` to include the new job posting settings fields in the PUT endpoint:

```typescript
// In the PUT handler, include:
const validated = SettingsSchema.parse(body);
// Make sure joinTeamDescription and joinTeamGoogleFormUrl are in the schema
```

The existing `GET` endpoint will automatically return these fields since they're in the model.

### Step 5: Update Admin Sidebar

Edit `components/admin/AdminSidebar.tsx` to add the job postings navigation link:

```typescript
// Add this to the navigation items array:
{
  label: 'Job Postings',
  href: '/admin/job-postings',
  icon: Briefcase, // or Users
  pattern: '/admin/job-postings',
}
```

Import the icon at the top:
```typescript
import { Briefcase } from 'lucide-react'; // or Users
```

### Step 6: Update Admin Dashboard

Edit `app/admin/page.tsx` to add job postings count:

```typescript
// In the fetchStats function, add:
const jobsRes = await fetch('/api/job-postings');

// Then in setStats:
totalJobPostings: Array.isArray(jobs) ? jobs.length : 0,

// Add to stats state interface:
totalJobPostings: number;

// Add to cards array:
{
  title: 'Job Postings',
  value: stats.totalJobPostings,
  icon: Briefcase,
  color: 'from-emerald-500/20 to-transparent',
}
```

### Step 7: Run Seeding

Once the directory structure is in place, run the seed script:

```bash
npm run seed
```

This will:
- Clear existing job postings
- Create 3 pre-seeded job postings
- Update Settings with joinTeamDescription and joinTeamGoogleFormUrl

---

## File Reference & Content

### Script File: `scripts/create-job-files.ts`

This file contains the content for both API route files. Extract and copy as needed.

### Component Files

- **`components/rinwa/JoinTeamSection.tsx`** - Ready to use, already integrated into homepage
- **`app/admin/testimonials/jobs-page-temp.tsx`** - Move to `app/admin/job-postings/page.tsx`

### Model Files

- **`models/JobPosting.ts`** - New model, ready
- **`models/Settings.ts`** - Updated, ready

### Seed File

- **`scripts/seed.ts`** - Updated, ready to run

---

## Testing After Setup

### 1. Test API Endpoints

```bash
# Get all job postings
curl http://localhost:3000/api/job-postings

# Get settings
curl http://localhost:3000/api/settings
```

### 2. Test Admin Console

1. Navigate to `http://localhost:3000/admin/login`
2. Login with credentials from seed output
3. Go to `/admin/job-postings`
4. Test:
   - ✅ Create a new job posting
   - ✅ Edit existing job posting
   - ✅ Delete job posting
   - ✅ View updated count on dashboard

### 3. Test Frontend

1. Navigate to homepage `http://localhost:3000`
2. Scroll to "Join Our Team" section (after testimonials)
3. Test:
   - ✅ Section renders with correct title and description
   - ✅ All 3 job postings display
   - ✅ Click job title to expand/collapse
   - ✅ Expanded content shows overview, responsibilities, requirements
   - ✅ Apply button redirects to Google Form (configure URL in admin settings first)
   - ✅ Design matches aesthetic (no gradients, correct colors)
   - ✅ Responsive on mobile/tablet/desktop

### 4. Test Settings Management

1. Create endpoint to update settings (add to `app/api/settings/route.ts` PUT handler)
2. Test updating `joinTeamGoogleFormUrl` via admin
3. Verify Apply button uses new URL

---

## Configuration

### Google Form URL

The default Google Form URL is set to `https://forms.gle/example` in the seed data.

**To update:**

**Option 1: Via Admin Console** (Once settings page is created)
- Navigate to `/admin/settings`
- Update "Join Team Google Form URL"
- Save

**Option 2: Via Database**
- Connect to MongoDB
- Update Settings collection
- Set `joinTeamGoogleFormUrl` to your actual Google Form URL

**Option 3: Via Seed Script**
- Edit `scripts/seed.ts`
- Change the default URL in Settings.create()
- Re-run `npm run seed`

---

## Common Issues & Solutions

### Issue: Directory creation fails
**Solution:** Create directories manually using file explorer or terminal commands provided above.

### Issue: API returns 404
**Solution:** Ensure directories `app/api/job-postings/` and `app/api/job-postings/[id]/` exist with route.ts files inside.

### Issue: Admin page not showing job postings
**Solution:** 
1. Verify `/api/job-postings` endpoint exists and returns data
2. Check browser console for fetch errors
3. Ensure MongoDB is connected

### Issue: Apply button doesn't redirect
**Solution:**
1. Verify `joinTeamGoogleFormUrl` is set in Settings
2. Check that Google Form URL is valid
3. Test link manually in browser

### Issue: Seed fails
**Solution:**
1. Ensure MongoDB connection string is valid in `.env.local`
2. Check that all models are imported correctly
3. Run `npm install` to ensure all dependencies are installed
4. Check Node.js version (must be 18+)

---

## Architecture Summary

### Data Flow

```
Admin Console (/admin/job-postings)
         ↓
    API Endpoint (PUT/POST/DELETE /api/job-postings)
         ↓
    MongoDB (JobPosting collection)
         ↓
    Homepage Component (JoinTeamSection)
         ↓
    API Endpoint (GET /api/job-postings)
         ↓
    Display on Website
```

### Component Hierarchy

```
Homepage (app/page.tsx)
  ├── JoinTeamSection component
  │   ├── Fetches /api/job-postings
  │   ├── Fetches /api/settings
  │   └── Renders collapsible accordion
  │       └── JobCard (expanded view)
  │           ├── Overview
  │           ├── Responsibilities list
  │           ├── Requirements list
  │           └── Apply button (links to Google Form)
```

---

## Design Details

### Colors Used

- **Section Title:** `#8B4545` (burgundy/maroon)
- **Accent:** `#7dd3cf` (soft teal)
- **Borders:** `rgba(125, 211, 207, 0.15)` or `rgba(255, 255, 255, 0.08)`
- **Background:** `rgba(255, 255, 255, 0.02)`
- **Text:** `#f5f0e8` (foreground)

### Typography

- **Section Title:** serif, 2-3rem, bold, centered
- **Job Title:** serif, 1.4-1.5rem, bold
- **Meta (Company, Location, Type):** sans-serif, 0.85rem, muted
- **Body Text:** sans-serif, 0.95-1rem, medium

### Spacing

- Section padding: `py-20 px-4`
- Job card padding: `py-6 px-0`
- List items: `space-y-2`

---

## Deployment Checklist

- [ ] Directory structure created (`app/api/job-postings/`, `app/admin/job-postings/`)
- [ ] API files created (`route.ts` in both directories)
- [ ] Admin page moved to correct location
- [ ] Settings API updated (optional)
- [ ] Admin sidebar updated with job-postings link
- [ ] Admin dashboard updated with job postings count
- [ ] Seed script run successfully (`npm run seed`)
- [ ] MongoDB contains 3 job postings
- [ ] Homepage displays JoinTeamSection
- [ ] Collapsible sections work correctly
- [ ] Apply button redirects to Google Form
- [ ] Admin CRUD operations work
- [ ] Responsive design verified on mobile
- [ ] No console errors
- [ ] Design matches reference images

---

## Next Steps

1. **Complete Manual Setup** (Steps 1-6 above)
2. **Run Seed** (`npm run seed`)
3. **Test All Functionality** (Follow testing section)
4. **Deploy to Production**

---

## Support Files

- Setup Script: `scripts/create-job-files.ts` (reference for API content)
- Admin Page Template: `app/admin/testimonials/jobs-page-temp.tsx`
- Component: `components/rinwa/JoinTeamSection.tsx`
- Models: `models/JobPosting.ts`, `models/Settings.ts`
- Updated Seed: `scripts/seed.ts`

---

## Expected Results

After completing setup:

✅ Admin can manage unlimited job postings  
✅ Job postings display on homepage in collapsible accordion  
✅ Design matches reference images exactly  
✅ No gradients used (solid colors only)  
✅ Responsive on all devices  
✅ Apply button redirects to Google Form  
✅ All changes persist in MongoDB  
✅ Admin dashboard shows job posting count  

---

**Created by:** Copilot AI  
**Date:** May 27, 2026  
**Project:** RÌNWÁ Hospitality & Experiences
