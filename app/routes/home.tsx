import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "Josh Felton Mathews" },
    { name: "description", content: "Software Engineer" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home() {
  return <h1 className="text-black">Hey, I'm Josh</h1>;
}
