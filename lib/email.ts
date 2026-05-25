import nodemailer from 'nodemailer';

type InquiryEmailPayload = {
  submission: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    projectDate: string;
    estimatedBudget: number;
    currency: string;
    description: string;
    industries: string[];
    goals?: string[];
    feelings?: string[];
  };
  adminEmail: string;
};

type EmailResult = {
  sent: boolean;
  warnings: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function formatList(items: string[]) {
  return items.length ? items.join(' • ') : 'Not provided';
}

function getCurrencySymbol(code: string): string {
  const map: Record<string, string> = { NGN: '₦', USD: '$', CAD: 'CA$', GBP: '£', EUR: '€' };
  return map[code] ?? code;
}

function formatBudget(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  return symbol + amount.toLocaleString();
}

function buildAdminEmailHtml(submission: InquiryEmailPayload['submission']) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px;width:38%;vertical-align:top;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#8fa8a5;border-bottom:1px solid rgba(255,255,255,0.05);">${label}</td>
      <td style="padding:12px 16px;vertical-align:top;font-size:14px;color:#e8f0ef;line-height:1.6;border-bottom:1px solid rgba(255,255,255,0.05);">${value}</td>
    </tr>`;

  const statCell = (label: string, value: string) => `
    <td style="padding:18px 20px;text-align:center;border-right:1px solid rgba(255,255,255,0.07);">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#7dd3cf;margin-bottom:6px;">${label}</div>
      <div style="font-size:15px;font-weight:600;color:#f5f0e8;">${value}</div>
    </td>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Inquiry</title></head>
<body style="margin:0;padding:0;background:#041114;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#041114;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">

        <!-- Header -->
        <tr><td style="padding-bottom:28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.12em;color:#f5f0e8;">RÌNWÁ</div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.32em;color:#8fa8a5;margin-top:3px;">Hospitality</div>
              </td>
              <td align="right">
                <span style="display:inline-block;background:#7dd3cf;color:#041114;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.24em;padding:5px 12px;border-radius:100px;">New Inquiry</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#07171a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">

          <!-- Intro -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.28em;color:#7dd3cf;">Inquiry received</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.15;color:#f5f0e8;font-weight:normal;">
                ${escapeHtml(submission.fullName)}<br>
                <span style="color:#8fa8a5;font-size:18px;">from ${escapeHtml(submission.company)}</span>
              </h1>
            </td></tr>

            <!-- Stats strip -->
            <tr><td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#041114;border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
                <tr>
                  ${statCell('Budget', escapeHtml(formatBudget(submission.estimatedBudget, submission.currency)))}
                  ${statCell('Timeline', escapeHtml(submission.projectDate))}
                  <td style="padding:18px 20px;text-align:center;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#7dd3cf;margin-bottom:6px;">Industries</div>
                    <div style="font-size:13px;font-weight:600;color:#f5f0e8;">${escapeHtml(submission.industries.join(' · '))}</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0;"></td></tr>

            <!-- Field table -->
            <tr><td style="padding:8px 16px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row('Full Name', escapeHtml(submission.fullName))}
                ${row('Email', '<a href="mailto:' + escapeHtml(submission.email) + '" style="color:#7dd3cf;text-decoration:none;">' + escapeHtml(submission.email) + '</a>')}
                ${row('Phone', escapeHtml(submission.phone))}
                ${row('Company', escapeHtml(submission.company))}
                ${row('Location', escapeHtml(submission.location))}
                ${row('Goals', escapeHtml(formatList(submission.goals || [])))}
                ${row('Feelings', escapeHtml(formatList(submission.feelings || [])))}
                ${row('Description', escapeHtml(submission.description).replace(/\n/g, '<br>'))}
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:28px 32px 32px;text-align:center;">
              <a href="mailto:${escapeHtml(submission.email)}?subject=Re: Your inquiry — RÌNWÁ"
                 style="display:inline-block;background:#7dd3cf;color:#041114;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;text-decoration:none;padding:14px 32px;border-radius:100px;">
                Reply to ${escapeHtml(submission.fullName.split(' ')[0])}
              </a>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#3d5a58;letter-spacing:0.1em;">
            RÌNWÁ Hospitality &nbsp;·&nbsp; Internal notification &nbsp;·&nbsp; Do not forward
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildUserEmailHtml(submission: InquiryEmailPayload['submission']) {
  const summaryRow = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 16px;width:40%;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#8fa8a5;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">${label}</td>
      <td style="padding:11px 16px;font-size:14px;color:#e8f0ef;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">${value}</td>
    </tr>`;

  const step = (num: string, title: string, body: string) => `
    <tr><td style="padding:0 0 20px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:26px;height:26px;border-radius:50%;background:#0d2a2e;border:1px solid #7dd3cf;text-align:center;line-height:24px;font-size:11px;font-weight:700;color:#7dd3cf;">${num}</div>
          </td>
          <td style="padding-left:14px;vertical-align:top;">
            <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#f5f0e8;">${title}</p>
            <p style="margin:0;font-size:13px;color:#8fa8a5;line-height:1.6;">${body}</p>
          </td>
        </tr>
      </table>
    </td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>We received your inquiry</title></head>
<body style="margin:0;padding:0;background:#041114;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#041114;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:32px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:0.14em;color:#f5f0e8;">RÌNWÁ</div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.36em;color:#8fa8a5;margin-top:4px;">Hospitality</div>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background:#07171a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0">

            <!-- Top accent bar -->
            <tr><td style="height:3px;background:linear-gradient(90deg,#7dd3cf,#4db6b0 50%,transparent);"></td></tr>

            <!-- Greeting -->
            <tr><td style="padding:36px 32px 28px;">
              <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.30em;color:#7dd3cf;">Inquiry confirmed</p>
              <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;color:#f5f0e8;font-weight:normal;">
                Your vision has been<br>received, ${escapeHtml(submission.fullName.split(' ')[0])}.
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.75;color:#a0bcba;">
                We've captured the shape of your project and will be in touch within&nbsp;48&nbsp;hours.
                In the meantime, here's a summary of what you shared with us.
              </p>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0;"></td></tr>

            <!-- Summary table -->
            <tr><td style="padding:8px 16px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${summaryRow('Company', escapeHtml(submission.company))}
                ${summaryRow('Location', escapeHtml(submission.location))}
                ${summaryRow('Industries', escapeHtml(formatList(submission.industries)))}
                ${summaryRow('Goals', escapeHtml(formatList(submission.goals || [])))}
                ${summaryRow('Feelings', escapeHtml(formatList(submission.feelings || [])))}
                ${summaryRow('Timeline', escapeHtml(submission.projectDate))}
                ${summaryRow('Budget', escapeHtml(formatBudget(submission.estimatedBudget, submission.currency)))}
              </table>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px 4px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0;"></td></tr>

            <!-- What's next -->
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 20px;font-size:11px;text-transform:uppercase;letter-spacing:0.26em;color:#7dd3cf;">What happens next</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${step('1', 'Your inquiry is reviewed', 'Our creative team reads every submission carefully — no templates, no shortcuts.')}
                ${step('2', 'We reach out within 48 hours', 'Expect a personal response from us at ' + escapeHtml(submission.email) + '.')}
                ${step('3', 'We shape the experience together', 'A brief discovery call to align on vision, scale, and ambition.')}
              </table>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0;"></td></tr>

            <!-- Sign-off -->
            <tr><td style="padding:28px 32px 36px;text-align:center;">
              <p style="margin:0 0 6px;font-size:14px;color:#8fa8a5;">Until then,</p>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f5f0e8;letter-spacing:0.08em;">The RÌNWÁ Team</p>
              <p style="margin:10px 0 0;font-size:12px;color:#3d5a58;font-style:italic;">Come here, you've arrived home.</p>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#3d5a58;">You received this because you submitted an inquiry on the RÌNWÁ website.</p>
          <p style="margin:0;font-size:11px;color:#2a3f3e;">RÌNWÁ Hospitality &nbsp;·&nbsp; Lagos, Nigeria</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendInquiryEmails({ submission, adminEmail }: InquiryEmailPayload): Promise<EmailResult> {
  const transporter = buildTransporter();
  const warnings: string[] = [];

  if (!transporter) {
    warnings.push('SMTP credentials are not configured');
    return { sent: false, warnings };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from) {
    warnings.push('SMTP_FROM is missing');
    return { sent: false, warnings };
  }

  const sendAdminEmail = async () => {
    try {
      await transporter.sendMail({
        from,
        to: adminEmail,
        replyTo: submission.email,
        subject: `[New Inquiry] ${submission.fullName} — ${submission.company}`,
        text: [
          `Name: ${submission.fullName}`,
          `Email: ${submission.email}`,
          `Phone: ${submission.phone}`,
          `Company: ${submission.company}`,
          `Location: ${submission.location}`,
          `Project Date: ${submission.projectDate}`,
          `Budget: ${formatBudget(submission.estimatedBudget, submission.currency)}`,
          `Industries: ${formatList(submission.industries)}`,
          `Goals: ${formatList(submission.goals || [])}`,
          `Feelings: ${formatList(submission.feelings || [])}`,
          '',
          submission.description,
        ].join('\n'),
        html: buildAdminEmailHtml(submission),
      });
      return true;
    } catch (error) {
      console.error('Failed to send admin inquiry email:', error);
      warnings.push('Failed to send admin notification email');
      return false;
    }
  };

  const sendUserEmail = async () => {
    try {
      await transporter.sendMail({
        from,
        to: submission.email,
        subject: 'Your vision has been received — RINWA',
        text: [
          `Thanks ${submission.fullName},`,
          '',
          'We received your inquiry and will respond within 48 hours.',
          '',
          `Location: ${submission.location}`,
          `Industries: ${formatList(submission.industries)}`,
          `Feelings: ${formatList(submission.feelings || [])}`,
          `Project Date: ${submission.projectDate}`,
          `Budget: ${formatBudget(submission.estimatedBudget, submission.currency)}`,
        ].join('\n'),
        html: buildUserEmailHtml(submission),
      });
      return true;
    } catch (error) {
      console.error('Failed to send user inquiry email:', error);
      warnings.push('Failed to send confirmation email to the submitter');
      return false;
    }
  };

  const adminSent = await sendAdminEmail();
  const userSent = await sendUserEmail();

  return {
    sent: adminSent && userSent,
    warnings,
  };
}

type GenericEmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

export async function sendEmail({ to, subject, text, html, from }: GenericEmailPayload): Promise<EmailResult> {
  const transporter = buildTransporter();
  const warnings: string[] = [];

  if (!transporter) {
    warnings.push('SMTP credentials are not configured');
    return { sent: false, warnings };
  }

  const _from = from || process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!_from) {
    warnings.push('SMTP_FROM is missing');
    return { sent: false, warnings };
  }

  try {
    await transporter.sendMail({
      from: _from,
      to,
      subject,
      text: text || '',
      html: html || text || '',
    });
    return { sent: true, warnings };
  } catch (err) {
    warnings.push('Failed to send email');
    return { sent: false, warnings };
  }
}