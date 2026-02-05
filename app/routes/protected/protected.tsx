import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { requireAuth } from "~/lib/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    await requireAuth(request, context.cloudflare.env);
  } catch (_) {
    return redirect("/login");
  }
  return {};
}

export default function ProtectedLayout() {
  return <Outlet />;
}
