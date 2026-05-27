import { connectDB } from '@/lib/mongodb';
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
