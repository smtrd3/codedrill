// import * as React from "react";
import '@radix-ui/themes/styles.css';
import type { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  createRootRouteWithContext as createRootRouteFactory,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { NotFound } from '~/components/NotFound';
import { ErrorComponent } from '~/components/ErrorComponent';
import { SEO_LINKS, SEO_META_HEADERS } from '~/constants/seo.constants';
import { If, Then } from 'react-if';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '~/lib/client/queryClient';

export const createRoute = createRootRouteFactory<{
  queryClient: QueryClient;
}>();

export const Route = createRoute({
  head: () => ({
    meta: SEO_META_HEADERS,
    links: SEO_LINKS,
  }),
  errorComponent: props => {
    return (
      <RootDocument>
        <ErrorComponent {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: _d => <NotFound />,
  component: () => (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV === 'development' && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          ></script>
        )}
      </head>
      <body>
        <Theme hasBackground={false} appearance="dark">
          {children}
          <If condition={process.env.NODE_ENV === 'development'}>
            <Then>
              <TanStackRouterDevtools position="bottom-right" />
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </Then>
          </If>
        </Theme>
        <Scripts />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
