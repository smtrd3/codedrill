import {
  ErrorComponent as RouterErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useCallback } from "react";
import { Else, If, Then } from "react-if";

export function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  const onInvalidate = useCallback(() => {
    router.invalidate();
  }, [router]);

  const goBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex">
        <If condition={process.env.NODE_ENV === "development"}>
          <Then>
            <RouterErrorComponent error={error} />
          </Then>
        </If>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={onInvalidate}>Try Again</button>
        <If condition={isRoot}>
          <Then>
            <Link to="/">Home</Link>
          </Then>
          <Else>
            <Link to="/" onClick={goBack}>
              Go Back
            </Link>
          </Else>
        </If>
      </div>
    </div>
  );
}
