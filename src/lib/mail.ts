import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true, // Port 465 = SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"mycleandent" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Passwort zurücksetzen – mycleandent",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #333;">
        <div style="background: #00385E; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">Passwort zurücksetzen</h1>
        </div>
        <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
          <p style="margin: 0 0 16px;">Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.</p>
          <p style="margin: 0 0 24px;">Klicken Sie auf den folgenden Button, um ein neues Passwort zu vergeben. Der Link ist <strong>1 Stunde</strong> gültig.</p>
          <a href="${resetUrl}"
             style="display: inline-block; background: #00385E; color: #fff; padding: 14px 28px;
                    border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
            Passwort zurücksetzen
          </a>
          <p style="margin: 24px 0 0; font-size: 13px; color: #888;">
            Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa; margin: 0;">
            mycleandent – Ihr Mitglieder-Portal
          </p>
        </div>
      </div>
    `,
  });
}
