import { Loader2 } from "lucide-react";
import { Route } from "wouter";

// Demo mode - no authentication needed, all routes accessible
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Demo mode - always show component directly
  return <Route path={path} component={Component} />;
}
