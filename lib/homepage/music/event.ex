defmodule Homepage.Music.Event do
  @moduledoc false
  use Ecto.Schema

  schema "events" do
    field :location, :string
    field :link, :string
    field :datetime, :utc_datetime

    timestamps()
  end
end
