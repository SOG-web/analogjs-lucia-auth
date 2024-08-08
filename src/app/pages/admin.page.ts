import { getLoadResolver, injectRouter, RouteMeta } from "@analogjs/router";
import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { adminGuard } from "../guards/admin.guard";

export const routeMeta: RouteMeta = {
  title: "Admin Page",
  // resolve: {
  //   sessionData: async (route) => {
  //     const data = await getLoadResolver(route);
  //     return data;
  //   },
  // },
  canActivate: [adminGuard],
};

@Component({
  standalone: true,
  selector: "admin-layout",
  imports: [RouterOutlet],
  template: `
    <h1>Admin</h1>
    <router-outlet></router-outlet>
  `,
})
export default class AdminLayoutComponent {}
