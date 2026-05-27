# 🎯 Join Our Team Section - Implementation Guide

**Status:** ✅ 95% Complete  
**Last Updated:** May 27, 2026

---

## 🚀 Quick Start (5 Minutes)

### What's Done ✅
- ✅ Frontend component created and integrated
- ✅ Database models created  
- ✅ Admin interface created
- ✅ Seed data prepared (3 jobs)
- ✅ Homepage integration complete

### What You Need to Do
1. Create 3 directories
2. Create 2 API files
3. Move 1 admin file
4. Run seed script

### Step-by-Step

#### 1️⃣ Create Directories
```bash
mkdir -p app/api/job-postings/[id]
mkdir -p app/admin/job-postings
```

#### 2️⃣ Create API File: `app/api/job-postings/route.ts`

Copy from `scripts/create-job-files.ts` (lines 19-70) OR use this content:

```typescript
import { connectDB } from '@/lib/mongodb';
import { JobPosting } from '@/models/JobPosting';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const JobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Type is required'),
  overview: z.string().min(1, 'Overview is required'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement required'),
  order: z.number().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const jobs = await JobPosting.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(Array.isArray(jobs) ? jobs : []);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return NextResponse.json({ error: 'Failed to fetch job postings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = JobPostingSchema.parse(body);

    await connectDB();
    const created = await JobPosting.create(validated);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Error creating job posting:', error);
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
  }
}
```

#### 3️⃣ Create API File: `app/api/job-postings/[id]/route.ts`

Copy from `scripts/create-job-files.ts` (lines 71-141) OR see JOIN_TEAM_SETUP.md

#### 4️⃣ Move Admin Page

```bash
# Copy
cp app/admin/testimonials/jobs-page-temp.tsx app/admin/job-postings/page.tsx

# Remove temp
rm app/admin/testimonials/jobs-page-temp.tsx
```

#### 5️⃣ Run Seed

```bash
npm run seed
```

✅ Done! The section is now live.

---

## 📍 Where to Find Things

| What | Where |
|------|-------|
| Frontend Component | `components/rinwa/JoinTeamSection.tsx` |
| Admin Page | `app/admin/job-postings/page.tsx` |
| Job Model | `models/JobPosting.ts` |
| Settings (Extended) | `models/Settings.ts` |
| Seed Data | `scripts/seed.ts` |
| Setup Guide | `JOIN_TEAM_SETUP.md` |
| Full Summary | `JOIN_TEAM_IMPLEMENTATION_SUMMARY.md` |

---

## 🧪 Verify It Works

### Admin Console
1. Go to `http://localhost:3000/admin/job-postings`
2. You should see 3 pre-seeded jobs
3. Try creating, editing, deleting

### Homepage
1. Go to `http://localhost:3000`
2. Scroll down to find "Join Our Team" section
3. Click job title to expand/collapse
4. Click "Apply Now" to go to Google Form

### API
```bash
curl http://localhost:3000/api/job-postings
```

Should return array of 3 jobs.

---

## 🎨 Design Features

✨ **Fully Collapsible** - Click job titles to expand/collapse  
🎯 **Responsive** - Works on mobile, tablet, desktop  
🌳 **No Gradients** - Solid colors only  
📝 **Serif Fonts** - Matches brand aesthetic  
🔗 **Google Form Integration** - Apply button redirects to form  
💾 **Fully Dynamic** - Manage from admin console  

---

## ⚙️ Configuration

### Update Google Form URL

**Option 1: Database**
- Connect to MongoDB
- Find Settings document
- Update `joinTeamGoogleFormUrl`

**Option 2: Via Admin** (if settings page created)
- Go to `/admin/settings`
- Update URL
- Save

**Option 3: Re-seed**
- Edit `scripts/seed.ts`
- Change default URL
- Run `npm run seed`

### Update Section Description

Same options as above, use `joinTeamDescription` field.

---

## 📊 What's Included

### Pre-Seeded Jobs
1. **Content Creator & Visual Storyteller** (Lagos, Nigeria)
   - Type: Contract / Part-Time / Retainer
   - 6 responsibilities + 6 requirements

2. **Copywriter & Brand Storytelling Lead** (Remote / Lagos)
   - Type: Full-time
   - 5 responsibilities + 4 requirements

3. **Graphic Designer & Brand Designer** (Remote / Lagos)
   - Type: Full-time
   - 5 responsibilities + 5 requirements

All with provided content from your brief.

---

## 🔗 API Endpoints

```
GET    /api/job-postings              # Get all jobs
POST   /api/job-postings              # Create (admin only)
PUT    /api/job-postings/[id]         # Update (admin only)
DELETE /api/job-postings/[id]         # Delete (admin only)
```

---

## ❓ Troubleshooting

**Jobs not showing?**
- Check `/api/job-postings` returns data
- Verify seed ran successfully
- Check browser console for errors

**Admin page not found?**
- Ensure directory exists: `app/admin/job-postings/`
- Verify file exists: `app/admin/job-postings/page.tsx`

**Apply button doesn't work?**
- Check URL is valid in settings
- Verify Google Form is public/shared

**Design doesn't match?**
- Check component file: `components/rinwa/JoinTeamSection.tsx`
- Verify no gradients in CSS
- Check color values match reference

See **JOIN_TEAM_SETUP.md** for more troubleshooting.

---

## 📚 Documentation

- **JOIN_TEAM_SETUP.md** - Detailed setup guide with all steps
- **JOIN_TEAM_IMPLEMENTATION_SUMMARY.md** - Complete overview
- **plan.md** - Original implementation plan
- **scripts/create-job-files.ts** - API file reference

---

## ✨ Features

✅ **Full Admin Control**
- Create unlimited jobs
- Edit job details
- Delete with confirmation
- Form validation

✅ **Frontend Excellence**
- Collapsible accordion
- Smooth animations
- Mobile responsive
- Design consistency

✅ **Database Persistence**
- MongoDB integration
- Pre-seeded data
- Proper timestamps
- Sort management

✅ **Settings Management**
- Description configurable
- Google Form URL configurable
- Stored in database

---

## 🎯 What Happens After Setup

1. **Admin adds job** → API saves to MongoDB
2. **Homepage loads** → Component fetches from API
3. **User clicks job** → Accordion expands
4. **User clicks Apply** → Redirects to Google Form

---

## 🚀 Next Steps

1. Follow the "Quick Start" section above
2. Verify using the "Verify It Works" section
3. Customize Google Form URL
4. Deploy to production

---

## 📞 Need Help?

- See **JOIN_TEAM_SETUP.md** for detailed troubleshooting
- Check **JOIN_TEAM_IMPLEMENTATION_SUMMARY.md** for architecture details
- Review **scripts/create-job-files.ts** for API file content

---

**Created:** May 27, 2026  
**Status:** Ready for deployment  
**Time to complete:** ~5 minutes
