import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  route("admin", "routes/protected/protected.tsx", [
    route("posts", "routes/protected/posts.tsx"),
  ]),
  route("posts", "routes/posts.tsx"),
] satisfies RouteConfig;
