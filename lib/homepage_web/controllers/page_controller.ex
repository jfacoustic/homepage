defmodule HomepageWeb.PageController do
  use HomepageWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html", posts: Homepage.Blog.get_posts())
  end
end
