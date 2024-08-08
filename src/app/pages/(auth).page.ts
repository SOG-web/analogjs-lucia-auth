import { RouteMeta } from "@analogjs/router";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { loginGuard } from "../guards/login.guard";

export const routeMeta: RouteMeta = {
  title: "Login Page",
  // resolve: {
  //   sessionData: async (route) => {
  //     const data = await getLoadResolver(route);
  //     return data;
  //   },
  // },
  canActivate: [loginGuard],
};

@Component({
  standalone: true,
  selector: "auth-layout",
  imports: [RouterOutlet],
  template: `
    <h1>Auth</h1>
    <router-outlet></router-outlet>
  `,
})
export default class AuthLayoutComponent {}
