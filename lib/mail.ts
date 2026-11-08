import 'server-only'
import nodemailer from 'nodemailer'

/**
 * SMTP mailer. All credentials come from environment variables (cPanel):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 *   SMTP_SECURE ("true" for port 465), MAIL_FROM, MAIL_TO
 */

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
}

function getTransport() {
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendContactEmail(data: {
  name: string
  email: string
  phone: string
  message: string
}): Promise<void> {
  const transport = getTransport()
  const to = process.env.MAIL_TO || process.env.SMTP_USER
  const from = process.env.MAIL_FROM || process.env.SMTP_USER

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2a24;">
      <h2 style="color: #2f5d3a;">פנייה חדשה מהאתר</h2>
      <p><strong>שם:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>אימייל:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>טלפון:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>הודעה:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
  `

  await transport.sendMail({
    from,
    to,
    replyTo: data.email || undefined,
    subject: `פנייה חדשה מהאתר — ${data.name}`,
    html,
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
