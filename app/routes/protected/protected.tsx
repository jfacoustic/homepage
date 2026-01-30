import type { LoaderFunctionArgs } from "react-router";
import { Link, Outlet, redirect } from "react-router";
import { validateSession } from "~/lib/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionId = request.headers
    .get("Cookie")
    ?.match(/session=([^;]+)/)?.[1];

  if (!sessionId) {
    return redirect("/login");
  }

  const user = await validateSession(sessionId, context.cloudflare.env);
  if (!user) {
    return redirect("/login");
  }

  return { user };
}

export default function ProtectedLayout() {
  return <Outlet />;
}
