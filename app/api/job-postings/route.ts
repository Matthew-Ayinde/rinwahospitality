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
