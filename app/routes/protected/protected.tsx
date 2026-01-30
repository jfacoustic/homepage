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
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <nav className="flex space-x-4">
              <Link
                to="/admin/posts"
                className="text-gray-600 hover:text-gray-900"
              >
                Edit Posts
              </Link>
              <Link to="/logout" className="text-red-600 hover:text-red-800">
                Logout
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
