import { connectDB } from '@/lib/mongodb';
import { CommunityMember } from '@/models/CommunityMember';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const members = await CommunityMember.find().sort({ createdAt: -1 });

    const rows: string[][] = [
      ['Email', 'First Name', 'Joined At'],
      ...members.map((m) => [
        m.email,
        m.firstName || '',
        new Date(m.createdAt).toISOString(),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const date = new Date().toISOString().split('T')[0];

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="rinwa-community-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting community members:', error);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
