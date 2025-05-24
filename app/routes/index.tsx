import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Else, If, Then } from "react-if";
// import { db } from '~/db/connection';
// import { demoTable } from '~/db/schema';
import { delay } from "~/utils/general";

const getMessage = createServerFn().handler(async () => {
  // const demo = await db.select().from(demoTable);
  await delay(2000);
  return { message: "Hello world!" };
});

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    return getMessage();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const routerState = useRouterState();
  return (
    <If condition={routerState.isLoading}>
      <Then>Loading...</Then>
      <Else>
        <div>The message is : {data.message}</div>
      </Else>
    </If>
  );
}
