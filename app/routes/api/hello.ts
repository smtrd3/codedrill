import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/hello")({
  GET: ({ request, params: _ }) => {
    return json({
      url: request.url,
    });

    // return new Response(`<h1>Hello There</h1>`, {
    //   headers: {
    //     'Content-Type': 'text/html',
    //   },
    // });
  },
});
