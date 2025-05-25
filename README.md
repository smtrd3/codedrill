# Divsoup start

Starter template from `artefact.io`

## This is how we use session

```js
// get session interface
const session = await useAppSession();
session.data.userId; // read session data
await session.clear(); // clear session

// update session
await session.update((curr) => ({
  ...curr,
  userId: "UNIQUE_ID",
}));
```

## Example of api route with validation

```js
// app/routes/api.greet.ts or app/routes/api/greet.ts

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const Person = z.object({
  name: z.string(),
})

export const greet = createServerFn({ method: 'GET' })
  .validator((person: unknown) => {
    return Person.parse(person)
  })
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.name}!`
  })

greet({
  data: {
    name: 'John',
  },
})

```

## Example of middleware

```js
import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware().server(async ({ next, data }) => {
  console.log("Request received:", data);
  const result = await next();
  console.log("Response processed:", result);
  return result;
});

// then use in server functions
const fn = createServerFn()
  .middleware([loggingMiddleware])
  .handler(async () => {
    // ...
  });
```

## Client middleware

```js
import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware().client(async ({ next }) => {
  console.log("Request sent");
  const result = await next();
  console.log("Response received");
  return result;
});
```

## Show loader when router is fetching data

```js
const isFetching = useRouterState({ select: (s) => s.isLoading });
```

## To create db run

```sh
bunx drizzle-kit push -> quickly apply schema changes without migration file changes
bunx drizzle-kit generate -> generate amigration
bunx drizzle-kit migrate -> apply a migration
```
