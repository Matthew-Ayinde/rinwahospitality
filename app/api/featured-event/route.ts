import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';

/**
 * GET /api/featured-event
 * Returns all active featured events sorted by order (for carousel)
 * Falls back to first event for backward compatibility
 */
export async function GET() {
  try {
    await connectDB();
    const events = await FeaturedEvent.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    if (events.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Featured events fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/featured-event
 * Create a new featured event
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const maxOrder = await FeaturedEvent.findOne()
      .sort({ order: -1 })
      .select('order')
      .lean() as { order?: number } | null;

    const newEvent = new FeaturedEvent({
      ...body,
      order: (maxOrder?.order ?? -1) + 1,
      media: body.media || [],
    });

    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Featured event creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create featured event' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/featured-event
 * Backward compatibility: updates first/single event if no ID provided
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    let event = await FeaturedEvent.findOne();

    if (!event) {
      event = new FeaturedEvent(body);
    } else {
      Object.assign(event, body);
    }

    await event.save();
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Featured event update error:', error);
    return NextResponse.json(
      { error: 'Failed to update featured event' },
      { status: 500 }
    );
  }
}
