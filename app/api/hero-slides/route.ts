import { connectDB } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { heroSlideSchema } from '../../../lib/hero-slides';
import { z } from 'zod';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(slides, { status: 200 });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = heroSlideSchema.parse(body);

    await connectDB();
    const slide = await HeroSlide.create(validated);

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map((issue) => issue.message);
      return NextResponse.json(
        { error: issues[0], details: issues, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide', code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}
