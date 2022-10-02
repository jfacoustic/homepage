defmodule HomepageWeb.PostController do
  use HomepageWeb, :controller

  alias Homepage.Blog

  plug HomepageWeb.Protected when action in [:new, :create]

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

  def show(conn, %{"id" => raw_id}) do
    {id, _} = Integer.parse(raw_id)

    if is_integer(id) do
      post = Blog.get_post(id)

      render(conn, "show.html", post: post)
    else
      conn
      |> put_flash(:error, "no post found")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def index(conn, _params) do
    render(conn, "index.html", posts: Blog.get_posts())
  end
end
