import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';

/**
 * POST /api/featured-events
 * Create a new featured event with auto-incrementing order
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'description', 'location', 'date', 'time'];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json(
          { error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` },
          { status: 400 }
        );
      }
    }

    // Validate media
    if (!body.media || !Array.isArray(body.media) || body.media.length !== 1) {
      return NextResponse.json(
        { error: 'Exactly one image is required' },
        { status: 400 }
      );
    }

    if (!body.media[0].imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const maxOrder = await FeaturedEvent.findOne()
      .sort({ order: -1 })
      .select('order')
      .lean();

    const newEvent = new FeaturedEvent({
      ...body,
      order: (maxOrder?.order ?? -1) + 1,
      media: body.media,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Featured event creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create featured event';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/featured-events
 * Get all featured events sorted by order
 */
export async function GET() {
  try {
    await connectDB();
    const events = await FeaturedEvent.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Featured events fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
}
