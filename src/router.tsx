import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { routeTree } from './routeTree.gen';
import { ErrorComponent } from './components/ErrorComponent';
import { queryClient } from './lib/client/queryClient';
import { NotFound } from './components/NotFound';

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      defaultErrorComponent: ErrorComponent,
      defaultNotFoundComponent: () => <NotFound />,
      scrollRestoration: true,
    }),
    queryClient
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
