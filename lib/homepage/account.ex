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

  def authenticate(username, password) do
    user = Repo.get_by!(User, username: username)

    if user && Argon2.verify_pass(password, user.password_hash) do
      :ok
    else
      Argon2.no_user_verify()
      :unauthorized
    end
  end
end
