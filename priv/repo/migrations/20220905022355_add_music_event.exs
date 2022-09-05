defmodule Homepage.Repo.Migrations.AddMusicEvent do
  use Ecto.Migration

  def change do
    create table("events") do
      add :location, :string
      add :link, :string
      add :datetime, :utc_datetime

      timestamps()
    end
  end
end
