defmodule HomepageWeb.Auth do
  import Plug.Conn
  def init(opts), do: opts

  def call(conn, _opts) do
    if get_session(conn, :authenticated) do
      conn
      |> assign(:authenticated, true)
    else
      conn
      |> assign(:authenticated, false)
    end
  end

  def login(conn) do
    conn
    |> assign(:authenticated, true)
    |> put_session(:authenticated, true)
    |> configure_session(renew: true)
  end

  def logout(conn) do
    configure_session(conn, drop: true)
  end
end
