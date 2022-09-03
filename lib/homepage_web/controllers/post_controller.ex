defmodule HomepageWeb.PostController do
  use HomepageWeb, :controller

  alias Homepage.Blog

  def new(conn, _params) do
    changeset = Blog.change_post(%Blog.Post{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"post" => post_params}) do
    {:ok, post} = Blog.create_post(post_params)

    conn
    |> put_flash(:info, "#{post.title} created")
    |> redirect(to: Routes.page_path(conn, :index))
  end

  def index(conn, _params) do
    render(conn, "index.html", posts: Blog.get_posts())
  end
end
