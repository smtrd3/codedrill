import { redirect } from "@tanstack/react-router";

export function goto(to: string, code = 301) {
  throw redirect({ to, code });
}

export function gotoExternal(to: string) {
  throw redirect({ href: to });
}
