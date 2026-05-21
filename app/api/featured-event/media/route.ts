import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FeaturedEvent } from '@/models/FeaturedEvent';
import { deleteCloudinaryAssets } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    let event = await FeaturedEvent.findOne();

    if (!event) {
      event = new FeaturedEvent({
        title: 'Featured Event',
        subtitle: '',
        description: '',
        location: '',
        date: '',
        time: '',
        media: [],
      });
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

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { mediaId, order } = body;

    const event = await FeaturedEvent.findOne();

    if (!event) {
      return NextResponse.json(
        { error: 'Featured event not found' },
        { status: 404 }
      );
    }

    const media = event.media.find((m: any) => m._id.toString() === mediaId);
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    if (order !== undefined) {
      Object.assign(media, { order });
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

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    const event = await FeaturedEvent.findOne();

    if (!event) {
      return NextResponse.json(
        { error: 'Featured event not found' },
        { status: 404 }
      );
    }

    const removed = event.media.find((m: any) => m._id.toString() === mediaId);
    event.media = event.media.filter((m: any) => m._id.toString() !== mediaId);
    await event.save();

    await deleteCloudinaryAssets([removed?.imageUrl, removed?.posterUrl]);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
