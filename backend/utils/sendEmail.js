import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // oder dein SMTP-Dienst
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html
  })
}
