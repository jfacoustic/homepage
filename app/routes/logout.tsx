import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { clearSessionCookie, deleteSession, validateSession } from "~/lib/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionId = request.headers
    .get("Cookie")
    ?.match(/session=([^;]+)/)?.[1];

  if (!sessionId) {
    return redirect("/login");
  }

  const user = await validateSession(sessionId, context.cloudflare.env);
  if (!user) {
    return clearSessionCookie();
  }

  await deleteSession(sessionId, context.cloudflare.env);
  return clearSessionCookie();
}
