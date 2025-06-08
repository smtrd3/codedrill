import { betterAuth, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '~/db/connection';
import { reactStartCookies } from 'better-auth/react-start';
import { sendEmail } from '~/utils/server';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { EmailVerificationTemplate } from '~/templates/verify-email';
import { user, session, account, verification } from '~/db/auth-schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, session, account, verification },
    debugLogs: true,
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
    callbackURL: '/app',
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

      await sendEmail(user.email, 'Verify your email', undefined, template);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  plugins: [reactStartCookies()],
});
