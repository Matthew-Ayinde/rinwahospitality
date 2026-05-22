import { connectDB } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { deleteCloudinaryAssets } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Types } from 'mongoose';
import { updateHeroSlideSchema } from '../../../../lib/hero-slides';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(slide, { status: 200 });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slide', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updateHeroSlideSchema.parse(body);

    await connectDB();
    const slide = await HeroSlide.findByIdAndUpdate(id, validated, { new: true });

    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(slide, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map((issue) => issue.message);
      return NextResponse.json(
        { error: issues[0], details: issues, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide', code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const slide = await HeroSlide.findByIdAndDelete(id);

    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    await deleteCloudinaryAssets([slide.imageUrl, slide.videoUrl]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide', code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}
