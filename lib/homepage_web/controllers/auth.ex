defmodule HomepageWeb.Auth do
  import Plug.Conn
  import Phoenix.Controller
  alias HomepageWeb.Router.Helpers, as: Routes
  def init(opts), do: opts

  def call(conn, _opts) do
    if get_session(conn, :authenticated) do
      conn
    else
      conn
      |> put_flash(:error, "Page not found")
      |> redirect(to: Routes.page_path(conn, :index))
      |> halt()
    end
  end

  def login(conn) do
    put_session(conn, :authenticated, true)
  end
end
