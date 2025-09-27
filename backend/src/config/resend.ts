import { Resend } from 'resend';
import ENV from '../lib/env.js';

const resend = new Resend(ENV.RESEND_API_KEY);

async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Your App <royalchats.com>', 
      to,
      subject: '🎉 Welcome to Our App!',
      html: `
        <h1>Hi ${name},</h1>
        <p>Welcome to <b>Our Platform</b>! We're excited to have you on board 🚀</p>
        <p>Get started by exploring your. Later more features coming</p>
      `,
    });

    if (error) {
      console.error('Email send failed:', error);
      return;
    }

    console.log('Email sent:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}
