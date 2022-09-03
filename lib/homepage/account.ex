defmodule Homepage.Account do
  alias Homepage.Account.User
  alias Homepage.Repo

  def create_user(attrs) do
    if Enum.empty?(Repo.all(User)) do
      %User{} |> User.changeset(attrs) |> Repo.insert()
    end
  end

  def update_user(attrs) do
    Homepage.Repo.all(User)
    |> Enum.at(0)
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def get_user do
    Homepage.Repo.all(User) |> Enum.at(0)
  end
end
