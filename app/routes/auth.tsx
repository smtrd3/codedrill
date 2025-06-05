import { createFileRoute } from '@tanstack/react-router';
import { AuthComponent } from '../components/AuthComponent';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <AuthComponent />
    </div>
  );
}
