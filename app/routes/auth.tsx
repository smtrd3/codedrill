import { useCallback } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthComponent, SocialProvider } from '../components/AuthComponent';
import { authClient } from '~/lib/client/auth-client';
import { snackbar } from '~/utils/snackbars';
import { createServerFn } from '@tanstack/react-start';
import { getUser, goto } from '~/utils/server';
import { ArrowLeft } from 'lucide-react';

export const withAuth = createServerFn().handler(async () => {
  const user = await getUser();
  if (user) {
    goto('/app', 302);
  }
});

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  loader: async () => {
    await withAuth();
  },
});

function AuthPage() {
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
        },
        onError: () => {
          snackbar.error('Failed to register');
        },
      }
    );
  }, []);

  const onLogin = useCallback(async (email: string, password: string) => {
    await authClient.signIn.email({
      email,
      password,
      callbackURL: '/app',
    });

    return { require2FA: false };
  }, []);

  const onSocialLogin = useCallback(async (provider: SocialProvider) => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/app',
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="min-w-[420px] flex flex-col gap-4 items-center">
        <div>
          <Link
            className="text-sm text-gray-500 flex items-center gap-2"
            to="/"
          >
            <ArrowLeft size={16} />
            CodeDrill
          </Link>
        </div>
        <AuthComponent
          onRegister={onRegister}
          onLogin={onLogin}
          enableEmailVerification={true}
          onSocialLogin={onSocialLogin}
        />
      </div>
    </div>
  );
}
