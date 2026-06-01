import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function GET() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return NextResponse.json({ ok: false, error: 'SMTP env vars missing' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.verify();
    return NextResponse.json({ ok: true, message: 'SMTP credentials verified successfully' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, code: err.code }, { status: 500 });
  }
}
