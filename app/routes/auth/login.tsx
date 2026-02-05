import type { ActionFunctionArgs } from "react-router";
import { Form, useActionData } from "react-router";
import TextInput from "~/components/form/text-input";
import { createSession, setSessionCookie, verifyPassword } from "~/lib/auth";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH } = context.cloudflare.env;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  if (username !== ADMIN_USERNAME) {
    return { error: "Invalid credentials" };
  }

  const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  if (!isValidPassword) {
    return { error: "Invalid credentials" };
  }

  const sessionId = await createSession(context.cloudflare.env);
  return setSessionCookie(sessionId);
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4">
            <TextInput
              labelText="Username"
              name="username"
              type="text"
              required
              autoComplete="username"
            />

            <TextInput
              labelText="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
