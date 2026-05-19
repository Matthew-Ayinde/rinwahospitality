import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';

/**
 * GET /api/featured-events/[id]
 * Fetch a specific featured event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await FeaturedEvent.findById(params.id);

    if (!event) {
      return NextResponse.json(
        { error: 'Featured event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Featured event fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured event' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/featured-events/[id]
 * Update a specific featured event
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields if provided
    const requiredFields = ['title', 'subtitle', 'description', 'location', 'date', 'time'];
    for (const field of requiredFields) {
      if (field in body && (typeof body[field] !== 'string' || !body[field].trim())) {
        return NextResponse.json(
          { error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` },
          { status: 400 }
        );
      }
    }

    // Validate media if provided
    if ('media' in body) {
      if (!Array.isArray(body.media) || body.media.length !== 1) {
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
    }

    const event = await FeaturedEvent.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json(
        { error: 'Featured event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Featured event update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update featured event';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/featured-events/[id]
 * Delete a featured event and reorder remaining events
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const event = await FeaturedEvent.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Featured event not found' },
        { status: 404 }
      );
    }

    const deletedOrder = event.order;
    await FeaturedEvent.deleteOne({ _id: params.id });

    // Reorder remaining events
    await FeaturedEvent.updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    );

    return NextResponse.json(
      { message: 'Featured event deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Featured event deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete featured event' },
      { status: 500 }
    );
  }
}
