import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <nav className="flex space-x-4">
              <a href="/posts" className="text-gray-600 hover:text-gray-900">
                Posts
              </a>
              <a href="/logout" className="text-red-600 hover:text-red-800">
                Logout
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
