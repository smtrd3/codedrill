import { redirect } from '@tanstack/react-router';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '~/lib/server/auth';
import nodemailer from 'nodemailer';
import { createServerFn } from '@tanstack/react-start';
import { isEmpty } from 'lodash-es';

const getHeaders = createServerFn().handler(async () => {
  const req = getWebRequest();
  const headers: Record<string, string> = {};

  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return headers;
});

export function goto(to: string, code = 301) {
  throw redirect({ to, code });
}

export function gotoExternal(to: string) {
  throw redirect({ href: to });
}

export const getAuthState = createServerFn().handler(async () => {
  const headers = await getHeaders();

  if (isEmpty(headers)) {
    return null;
  }

  const user = await auth.api.getSession({
    headers: new Headers(headers),
  });

  return user;
});

export async function getUser() {
  const authState = await getAuthState();
  return authState?.user;
}

export async function getSession() {
  const authState = await getAuthState();
  return authState?.session;
}

export async function getUserId() {
  const authState = await getAuthState();
  return authState?.user?.id;
}

export const handleAuthRedirect = createServerFn().handler(async () => {
  const user = await getUser();
  if (!user) {
    goto('/auth', 302);
  }
});

export const handleAppRedirect = createServerFn().handler(async () => {
  const user = await getUser();
  if (user) {
    goto('/app', 302);
  }
});

export const sendEmail = createServerFn()
  .validator(
    (input: { to: string; subject: string; text?: string; html?: string }) =>
      input
  )
  .handler(async ctx => {
    console.log('Sending email to: ', ctx.data.to);
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
        to: ctx.data.to,
        subject: ctx.data.subject,
        [ctx.data.text ? 'text' : 'html']: ctx.data.text || ctx.data.html || '',
      });
      console.log('Email sent: ', result);
      return true;
    } catch (error) {
      console.error('Cannot send email error: ', error);
      return false;
    }
  });
