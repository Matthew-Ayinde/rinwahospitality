import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';

/**
 * PUT /api/featured-events/reorder
 * Bulk update order of multiple featured events
 * Request body: { events: [{ _id: string, order: number }, ...] }
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { events } = await request.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid request: events must be an array' },
        { status: 400 }
      );
    }

    // Perform bulk updates
    const updates = events.map(({ _id, order }) =>
      FeaturedEvent.findByIdAndUpdate(_id, { order }, { new: true })
    );

    const results = await Promise.all(updates);
    const reordered = await FeaturedEvent.find()
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(reordered, { status: 200 });
  } catch (error) {
    console.error('Featured events reorder error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder featured events' },
      { status: 500 }
    );
  }
}
