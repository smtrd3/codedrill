// import { Link } from '@tanstack/react-router'

import { ReactNode } from "react";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="flex justify-center p-4">
      <h3>404 - this route does not exist</h3>
      <div>
        {children}
        {/* Or go somewhere using Link */}
      </div>
    </div>
  );
}
