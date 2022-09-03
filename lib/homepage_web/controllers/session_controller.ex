defmodule HomepageWeb.SessionController do
  use HomepageWeb, :controller

  def new(conn, _) do
    render(conn, "new.html")
  end

  def create(conn, %{"session" => %{"username" => username, "password" => password}}) do
    case Homepage.Account.authenticate(username, password) do
      :ok ->
        conn
        |> HomepageWeb.Auth.login()
        |> put_flash(:info, "Logged in")
        |> redirect(to: Routes.page_path(conn, :index))

      :unauthorized ->
        conn |> put_flash(:error, "Don't try to pwn me.") |> render("new.html")
    end
  end

  def delete(conn, _) do
    conn
    |> HomepageWeb.Auth.logout()
    |> redirect(to: Routes.page_path(conn, :index))
  end
end
