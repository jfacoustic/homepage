import type { ActionFunctionArgs } from "react-router";
import TextInput from "~/components/form/text-input";
import { hashPassword, requireAuth } from "~/lib/auth";
import type { Route } from "./+types/management";

export async function action({ request, context }: ActionFunctionArgs) {
  await requireAuth(request, context.cloudflare.env);
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password === "string" && password.length > 0) {
    try {
      const hash = await hashPassword(password);
      return { hash, error: null };
    } catch (_error) {
      return { hash: null, error: "Failed to generate hash" };
    }
  }

  return { hash: null, error: "Password required" };
}

export default function Management({ actionData }: Route.ComponentProps) {
  const hash = actionData?.hash;
  const error = actionData?.error;

  const copyToClipboard = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Management</h1>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Password Hash Generator</h2>

        <form method="POST" className="space-y-4">
          <TextInput
            labelText="Password"
            name="password"
            type="password"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Generate Hash
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {hash && (
          <div className="mt-6 p-4 bg-white border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Generated Hash:</h3>
              <button
                type="button"
                onClick={copyToClipboard}
                className="bg-gray-800 text-white text-sm px-3 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="font-mono text-xs break-all bg-gray-100 p-3 rounded">
              {hash}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
