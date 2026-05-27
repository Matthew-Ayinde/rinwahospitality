import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

// Create directories
const dirs = [
  'app/api/job-postings',
  'app/api/job-postings/[id]',
  'app/admin/job-postings',
];

dirs.forEach(dir => {
  const fullPath = join(projectRoot, dir);
  mkdirSync(fullPath, { recursive: true });
  console.log(`✓ Created directory: ${dir}`);
});

// Create API route files
const jobPostingsRoute = `import { connectDB } from '@/lib/mongodb';
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
`;

const jobPostingsIdRoute = `import { connectDB } from '@/lib/mongodb';
import { JobPosting } from '@/models/JobPosting';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const JobPostingUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  company: z.string().min(1, 'Company is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  overview: z.string().min(1, 'Overview is required').optional(),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility required').optional(),
  requirements: z.array(z.string()).min(1, 'At least one requirement required').optional(),
  order: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = JobPostingUpdateSchema.parse(body);

    await connectDB();
    const updated = await JobPosting.findByIdAndUpdate(id, validated, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Error updating job posting:', error);
    return NextResponse.json({ error: 'Failed to update job posting' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const deleted = await JobPosting.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 });
  }
}
`;

// Write files
writeFileSync(join(projectRoot, 'app/api/job-postings/route.ts'), jobPostingsRoute);
console.log('✓ Created: app/api/job-postings/route.ts');

writeFileSync(join(projectRoot, 'app/api/job-postings/[id]/route.ts'), jobPostingsIdRoute);
console.log('✓ Created: app/api/job-postings/[id]/route.ts');

console.log('\n✅ File structure created successfully!');
