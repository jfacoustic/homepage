defmodule HomepageWeb.PageController do
  use HomepageWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html", post: Homepage.Blog.get_posts() |> Enum.reverse() |> Enum.at(0))
  end
end
