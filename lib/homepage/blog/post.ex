defmodule Homepage.Blog.Post do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  @type t() :: %__MODULE__{
          id: integer(),
          title: String.t(),
          content: String.t()
        }

  schema "posts" do
    field :title, :string
    field :content, :string

    timestamps()
  end

  def changeset(%__MODULE__{} = post, attrs) do
    post
    |> cast(attrs, [:title, :content])
    |> validate_required([:title, :content])
  end
end
