import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, note } = await request.json();

    if (!name || !email || !note) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // This must be a verified domain on Resend.
      to: ['myportfolio.h6m9q@simplelogin.com'], // CHANGE THIS to your email address.
      subject: `New message from ${name} on your portfolio!`,
      html: `<p>You received a new message from your portfolio contact form.</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Note:</strong></p>
             <p>${note}</p>`,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (e) {
    console.error('An unexpected error occurred:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 