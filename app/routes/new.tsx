import { createFileRoute } from '@tanstack/react-router';
import TypingPadNew from '~/components/TypingTest';

export const Route = createFileRoute('/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TypingPadNew />;
}
