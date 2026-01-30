import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("admin", "routes/protected.tsx", [
    route("posts", "routes/admin.posts.tsx"),
  ]),
  route("posts", "routes/posts.tsx"),
] satisfies RouteConfig;
