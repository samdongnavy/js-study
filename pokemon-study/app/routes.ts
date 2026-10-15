import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/list.tsx"),
  route("detail/:id", "routes/detail.tsx"),
] satisfies RouteConfig;
