import * as React from "react";
import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext as createRootRouteFactory,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NotFound } from "~/components/NotFound";
import { ErrorComponent } from "~/components/ErrorComponent";
import { SEO_LINKS, SEO_META_HEADERS } from "~/constants/seo.constants";
import { If, Then } from "react-if";

export const createRoute = createRootRouteFactory<{
  queryClient: QueryClient;
}>();

export const Route = createRoute({
  head: () => ({
    meta: SEO_META_HEADERS,
    links: SEO_LINKS,
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <ErrorComponent {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: (d) => <NotFound />,
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body cz-shortcut-listen="true">
        {children}
        <If condition={process.env.NODE_ENV === "development"}>
          <Then>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </Then>
        </If>
        <Scripts />
      </body>
    </html>
  );
}
