import { createFileRoute } from "@tanstack/react-router";
import App from "~/components/App";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return (
    // replace this with Dashboard
    <App />
  );
}
