import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    const normalizedCode = String(code ?? '').trim().replace(/[\s-]/g, '');

    if (!normalizedEmail || !normalizedCode) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    if (!/^\d{6}$/.test(normalizedCode)) {
      return NextResponse.json({ error: 'Code must be 6 digits' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail }).select('+resetCode +resetExpires +resetVerifiedUntil');

    if (!user || !user.resetCode || !user.resetExpires) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (user.resetExpires.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: 'Code expired' }, { status: 400 });
    }

    const match = await bcryptjs.compare(normalizedCode, user.resetCode as string);

    if (!match) {
      return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 400 });
    }

    user.resetVerifiedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
