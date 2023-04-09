defmodule Homepage.Music.Event do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :location, :string
    field :link, :string
    field :datetime, :utc_datetime

    timestamps()
  end

  def changeset(event, attrs) do
    event
    |> cast(attrs, [:location, :link, :datetime])
    |> validate_required([:location, :datetime])
  end
end
