defmodule HomepageWeb.PageView do
  use HomepageWeb, :view

  def get_post_preview(%Homepage.Blog.Post{} = post) do
    raw(Earmark.as_html!(post.content))
  end
end
