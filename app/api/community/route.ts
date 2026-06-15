import { connectDB } from '@/lib/mongodb';
import { CommunityMember } from '@/models/CommunityMember';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendCommunityEmails } from '@/lib/email';

export const runtime = 'nodejs';

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().trim().max(60).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = SubscribeSchema.parse(body);

    await connectDB();

    const existing = await CommunityMember.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already subscribed', code: 'ALREADY_SUBSCRIBED' },
        { status: 409 }
      );
    }

    const member = await CommunityMember.create({
      email: email.toLowerCase(),
      firstName: firstName || undefined,
    });

    const emailResult = await sendCommunityEmails({
      email,
      firstName,
      adminEmails: ['info@rinwahospitality.com', 'ayindematthew2003@gmail.com'],
    });

    if (!emailResult.sent) {
      console.warn('Member saved but emails failed:', emailResult.warnings);
    }

    return NextResponse.json(
      { success: true, id: member._id, emailDelivered: emailResult.sent },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    console.error('Error subscribing to community:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe', code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

    await connectDB();
    const total = await CommunityMember.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);

    const members = await CommunityMember.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((currentPage - 1) * limit);

    return NextResponse.json({
      members,
      total,
      limit,
      page: currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });
  } catch (error) {
    console.error('Error fetching community members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
