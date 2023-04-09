defmodule HomepageWeb.PageController do
  use HomepageWeb, :controller

  def index(conn, _params) do
    events =
      Homepage.Music.get_events()
      |> Enum.reverse()
      |> Enum.map(fn event ->
        %{
          id: event.id,
          link: event.link || "",
          location: event.location,
          datetime: time_to_string(event.datetime)
        }
      end)

    render(conn, "index.html",
      post: Homepage.Blog.get_posts() |> Enum.reverse() |> Enum.at(0),
      events: events
    )
  end

  defp time_to_string(time = %DateTime{}) do
    date = "#{time.month}/#{time.day}/#{time.year} at #{rem(time.hour, 13) + 1}:#{time.minute}"

    if (time.hour / 12) |> trunc == 0, do: date <> " am", else: date <> " pm"
  end
end
