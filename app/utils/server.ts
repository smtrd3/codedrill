import { redirect } from '@tanstack/react-router';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '~/lib/server/auth';
import nodemailer from 'nodemailer';

export function goto(to: string, code = 301) {
  throw redirect({ to, code });
}

export function gotoExternal(to: string) {
  throw redirect({ href: to });
}

export async function getAuthState() {
  const request = getWebRequest();

  if (!request) {
    return null;
  }

  const user = await auth.api.getSession({
    headers: request.headers,
  });

  return user;
}

export async function getUser() {
  const user = await getAuthState();
  return user?.user;
}

export async function getSession() {
  const user = await getAuthState();
  return user?.session;
}

export async function getUserId() {
  const user = await getAuthState();
  return user?.user?.id;
}

export async function sendEmail(
  to: string,
  subject: string,
  text?: string,
  html?: string
) {
  console.log('Sending email to: ', to);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GOOGLE_APP_PASSWORD!,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: process.env.GMAIL_USER!,
      to,
      subject,
      [text ? 'text' : 'html']: text || html || '',
    });
    console.log('Email sent: ', result);
    return true;
  } catch (error) {
    console.error('Cannot send email error: ', error);
    return false;
  }
}
