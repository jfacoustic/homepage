import { Link, Outlet } from "react-router";

export default function UiShellOutlet({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="w-full py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Josh Felton Mathews
            </h1>
            <nav className="flex space-x-4">
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              {isAdmin ? (
                <Link to="/logout" className="text-red-600 hover:text-red-800">
                  Logout
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </header>
      <main className="px-6">
        <Outlet />
      </main>
    </div>
  );
}
