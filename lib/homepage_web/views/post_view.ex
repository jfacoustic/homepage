defmodule HomepageWeb.PostView do
  use HomepageWeb, :view

  def get_post_content(%Homepage.Blog.Post{} = post) do
    raw(
      Earmark.as_html!(post.content, %Earmark.Options{
        code_class_prefix: "lang-",
        smartypants: false
      })
    )
  end
end
