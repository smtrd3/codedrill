import { createFileRoute } from '@tanstack/react-router';
import Homepage from '~/components/Homepage';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  ssr: true,
});

function RouteComponent() {
  return <Homepage />;
}
