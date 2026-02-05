import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { validateSession } from "~/lib/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionId = request.headers
    .get("Cookie")
    ?.match(/session=([^;]+)/)?.[1];

  if (!sessionId) {
    return redirect("/login");
  }

  const authenticated = await validateSession(
    sessionId,
    context.cloudflare.env
  );
  if (!authenticated) {
    return redirect("/login");
  }

  return {};
}

export default function ProtectedLayout() {
  return <Outlet />;
}
