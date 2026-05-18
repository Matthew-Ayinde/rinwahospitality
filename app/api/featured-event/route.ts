import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';

export async function GET() {
  try {
    await connectDB();
    const event = await FeaturedEvent.findOne().sort({ createdAt: -1 });
    
    if (!event) {
      return NextResponse.json(
        {
          title: 'Featured Event',
          subtitle: 'Coming Soon',
          description: 'No featured event yet.',
          location: '',
          date: '',
          time: '',
          media: [],
          isActive: false,
          order: 0,
        },
        { status: 200 }
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
