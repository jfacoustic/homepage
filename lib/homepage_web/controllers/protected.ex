defmodule HomepageWeb.Protected do
  use HomepageWeb, :controller

  def init(opts), do: opts

  def call(conn, _opts) do
    if get_session(conn, :authenticated) do
      conn
    else
      conn
      |> put_flash(:error, "Not found")
      |> redirect(to: Routes.page_path(conn, :index))
      |> halt()
    end
  end
end
