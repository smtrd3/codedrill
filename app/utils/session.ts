import { useSession } from '@tanstack/start/server';

type SessionUser = {
  userId: string;
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
  });
}
