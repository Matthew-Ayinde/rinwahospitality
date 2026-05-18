import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PastEvent } from '@/models/PastEvent';

export async function GET() {
  try {
    await connectDB();
    const events = await PastEvent.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Past events fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const lastEvent = await PastEvent.findOne().sort({ order: -1 });
    const newOrder = lastEvent ? lastEvent.order + 1 : 0;

    const newEvent = new PastEvent({
      ...body,
      order: newOrder,
      media: [],
      isActive: true,
    });

    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Past event create error:', error);
    return NextResponse.json(
      { error: 'Failed to create past event' },
      { status: 500 }
    );
  }
}
