defmodule HomepageWeb.EventController do
  use HomepageWeb, :controller
  alias Homepage.Music

  def new(conn, _params) do
    changeset = Music.change_event(%Music.Event{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, stuff) do
    require IEx
    IEx.pry()

    conn
    |> put_flash(:info, "created")
  end

  def delete(conn, %{"id" => raw_id}) do
    {id, _} = Integer.parse(raw_id)

    if is_integer(id) do
      post = Blog.get_post(id)

      Blog.delete_post(id)

      conn
      |> put_flash(:info, "#{post.title} deleted")
      |> redirect(to: Routes.post_path(conn, :index))
    else
      conn
      |> put_flash(:error, "Error deleting post.")
      |> redirect(to: Routes.post_path(conn, :index))
    end
  end
end
