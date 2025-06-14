import { betterAuth, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '~/db/connection';
import { reactStartCookies } from 'better-auth/react-start';
import { sendEmail } from '~/utils/server';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { EmailVerificationTemplate } from '~/templates/verify-email';
import { user, session, account, verification } from '~/db/auth-schema';
import { activity } from '~/db/schema';
import { createAuthMiddleware } from 'better-auth/api';
import { createInitialTemplates } from '~/utils/dao';

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  hooks: {
    after: createAuthMiddleware(async ctx => {
      const newSession = ctx.context.newSession;

      if (newSession) {
        if (
          ctx.path.startsWith('/verify-email') ||
          ctx.path.startsWith('/callback/:id')
        ) {
          await createInitialTemplates({
            data: { userId: newSession.user.id },
          });
        }
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, session, account, verification, activity },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: User;
      url: string;
      token: string;
    }) => {
      console.log('Sending verification email to: ', user.email);
      const template = renderToString(
        createElement(EmailVerificationTemplate, {
          userName: user.name,
          verificationLink: url,
          appName: 'CodeDrill',
        })
      );

      await sendEmail({
        data: { to: user.email, subject: 'Verify your email', html: template },
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  plugins: [reactStartCookies()],
});
