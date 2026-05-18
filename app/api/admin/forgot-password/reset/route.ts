import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    if (!normalizedEmail || !newPassword) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail }).select('+resetCode +resetExpires +resetVerifiedUntil');

    if (!user || !user.resetCode || !user.resetExpires || !user.resetVerifiedUntil) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (user.resetVerifiedUntil.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: 'Verification expired. Verify again.' }, { status: 400 });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetExpires = undefined;
    user.resetVerifiedUntil = undefined;

    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
