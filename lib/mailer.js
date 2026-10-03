const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function notifyNewLead(lead) {
  if (!transporter || !process.env.NOTIFY_EMAIL) {
    console.log('[mailer] SMTP not configured — lead saved to dashboard only:', lead.name);
    return;
  }
  const rows = [
    ['Name', lead.name], ['Phone', lead.phone], ['Email', lead.email], ['Town', lead.town],
    ['Pool type', lead.pool_type], ['Service', lead.service], ['Liner pattern', lead.liner_pattern], ['Message', lead.message],
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold">${k}</td><td style="padding:6px 12px">${esc(v)}</td></tr>`).join('');
  try {
    await transporter.sendMail({
      from: `"Merit Pools Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: lead.email || undefined,
      subject: `New request: ${lead.service || 'Pool inquiry'} — ${lead.name}`,
      html: `<h2 style="font-family:sans-serif;color:#0b3a6f">New website request</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
    });
  } catch (err) {
    console.error('[mailer] failed to send:', err.message);
  }
}

module.exports = { notifyNewLead };
