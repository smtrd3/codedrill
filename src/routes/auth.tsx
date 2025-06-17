import { useCallback, useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  AuthComponent,
  AuthComponentMode,
  SocialProvider,
} from '../components/AuthComponent';
import { authClient } from '~/lib/client/auth-client';
import { snackbar } from '~/utils/snackbars';
import { handleAppRedirect } from '~/utils/server';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    await handleAppRedirect();
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthComponentMode>('login');

  const onRegister = useCallback(async (email: string, password: string) => {
    await authClient.signUp.email(
      {
        email,
        password,
        name: email,
        callbackURL: '/app',
      },
      {
        onSuccess: () => {
          snackbar.success('Registration successful!');
          setAuthMode('verifyEmail');
        },
        onError: () => {
          snackbar.error('Something went wrong, please try again');
        },
      }
    );
  }, []);

  const onLogin = useCallback(
    async (email: string, password: string) => {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            navigate({ to: '/app' });
          },
          onError: (...args) => {
            console.error(args);
            snackbar.error('Failed to login, please try again');
          },
        }
      );

      return { require2FA: false };
    },
    [navigate]
  );

  const onSocialLogin = useCallback(async (provider: SocialProvider) => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/app',
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="min-w-[420px] flex flex-col gap-4 items-center">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
        <AuthComponent
          initialMode={authMode}
          onRegister={onRegister}
          onLogin={onLogin}
          enableEmailVerification={true}
          onSocialLogin={onSocialLogin}
        />
      </div>
    </div>
  );
}
