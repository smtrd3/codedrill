import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
  userId: string;
  accessToken?: string;
  refreshToken?: string;
};

/*
  Returns session interface like this:
  
  Promise<{
      readonly id: string | undefined;
      readonly data: SessionUser;
      update: (update: SessionUpdate<SessionUser>) => Promise<any>;
      clear: () => Promise<any>;
  }>
*/
export function useAppSession() {
  return useSession<SessionUser>({
    password: process.env.SESSION_SECRET!,
  });
}
