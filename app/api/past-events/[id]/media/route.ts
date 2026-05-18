import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PastEvent } from '@/models/PastEvent';
import mongoose from 'mongoose';

type RouteParams = { id: string };

export async function POST(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await PastEvent.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const newMedia = {
      imageUrl: body.imageUrl,
      mediaType: body.mediaType,
      posterUrl: body.posterUrl || undefined,
      caption: body.caption || undefined,
      order: event.media.length,
      isActive: true,
    };

    event.media.push(newMedia as any);
    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Media add error:', error);
    return NextResponse.json(
      { error: 'Failed to add media' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { mediaId } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await PastEvent.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const media = event.media.find((m: any) => m._id.toString() === mediaId);
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // If reordering, update order and sort
    if (body.order !== undefined) {
      Object.assign(media, { order: body.order });
      event.media.sort((a: any, b: any) => a.order - b.order);
    } else {
      Object.assign(media, body);
    }

    await event.save();
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Media update error:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await PastEvent.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    event.media = event.media.filter((m: any) => m._id.toString() !== mediaId);
    await event.save();

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
