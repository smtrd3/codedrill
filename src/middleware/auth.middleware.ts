import { createMiddleware } from '@tanstack/react-start';
import { getUser } from '~/utils/server';

export const authMiddleware = createMiddleware({
  type: 'function',
  validateClient: false,
}).server(async ({ next }) => {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  return next();
});
