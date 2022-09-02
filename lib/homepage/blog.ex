defmodule Homepage.Blog do
  alias Homepage.Repo
  alias Homepage.Blog.Post

  @spec create_post(%{
          title: String.t(),
          content: String.t()
        }) :: {:ok, Post.t()} | {:error, any}
  def create_post(post) do
    %Post{}
    |> Post.changeset(post)
    |> Repo.insert()
  end

  @spec get_post(id :: integer()) :: Post.t() | nil
  def get_post(id) do
    Repo.get(Post, id)
  end

  @spec get_posts() :: [Post.t()]
  def get_posts(), do: Repo.all(Post)

  @spec update_post(%{optional(any) => any, id: integer()}) :: {:ok, Post.t()} | {:error, any}
  def update_post(%{id: id} = attrs) do
    get_post(id)
    |> Post.changeset(attrs)
    |> Repo.update()
  end

  @spec delete_post(integer) :: any
  def delete_post(id), do: Repo.delete(%Post{id: id})
end
