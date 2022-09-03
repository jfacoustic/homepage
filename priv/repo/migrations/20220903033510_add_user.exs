defmodule Homepage.Repo.Migrations.AddUser do
  use Ecto.Migration

  def change do
    create table("users") do
      add :username, :string
      add :password_hash, :string
      timestamps()
    end
  end
end
