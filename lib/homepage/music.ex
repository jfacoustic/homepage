defmodule Homepage.Music do
  alias Homepage.Repo
  alias Homepage.Music.Event

  import Ecto.Query

  def change_event(event) do
    Event.changeset(event, %{})
  end

  def create_event(event) do
    %Event{}
    |> Event.changeset(event)
    |> Repo.insert()
  end

  @spec get_event(id :: integer()) :: Event.t() | nil
  def get_event(id) do
    Repo.get(Event, id)
  end

  @spec get_events() :: [Event.t()]
  def get_events(), do: Repo.all(Event)

  @spec update_event(%{optional(any) => any, id: integer()}) :: {:ok, Event.t()} | {:error, any}
  def update_event(%{id: id} = attrs) do
    get_event(id)
    |> Event.changeset(attrs)
    |> Repo.update()
  end

  @spec delete_event(integer) :: any
  def delete_event(id), do: Repo.delete(%Event{id: id})

  @spec get_upcoming_events() :: [Event.t()]
  def get_upcoming_events() do
    query =
      from e in Event,
        where: e.datetime > ^DateTime.utc_now()

    Repo.all(query)
  end
end
