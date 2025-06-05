import { redirect } from "@tanstack/react-router";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { authClient } from "~/utils/auth";
import { useAppSession } from "~/utils/session";

export const APIRoute = createAPIFileRoute("/api/callback")({
  GET: async ({ request }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = await useAppSession();

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const token = await authClient.exchange(
      code!,
      url.origin + "/api/callback",
    );

    if (token.err) {
      return new Response("Unauthorized", { status: 400 });
    }

    await session.update((curr) => {
      return {
        ...curr,
        accessToken: token.tokens.access,
        refreshToken: token.tokens.refresh,
      };
    });

    throw redirect({ to: "/" });
  },
});
