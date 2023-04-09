defmodule HomepageWeb.EventController do
  use HomepageWeb, :controller
  alias Homepage.Music

  def new(conn, _params) do
    changeset = Music.change_event(%Music.Event{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"event" => event_params}) do
    {:ok, event} = Music.create_event(event_params)

    conn
    |> put_flash(:info, "created")
    |> redirect(to: Routes.page_path(conn, :index))
  end

  def delete(conn, %{"id" => raw_id}) do
    {id, _} = Integer.parse(raw_id)

    event = Music.get_event(id)

    Music.delete_event(id)

    conn
    |> put_flash(:info, "#{event.location} deleted")
    |> redirect(to: Routes.page_path(conn, :index))
  end
end
