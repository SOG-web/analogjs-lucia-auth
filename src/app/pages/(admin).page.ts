import { getLoadResolver, injectRouter, RouteMeta } from "@analogjs/router";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

export const routeMeta: RouteMeta = {
  title: "Admin Page",
  resolve: {
    sessionData: async (route) => {
      const data = await getLoadResolver(route);
      return data;
    },
  },
  canActivate: [
    async (route) => {
      const data: any = await getLoadResolver(route);
      const router = injectRouter();

      if (!data.sessionId) {
        router.navigate(["/login"]);
      }

      return true;
    },
  ],
};

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Admin</h1>
    <router-outlet></router-outlet>
  `,
})
export default class AdminLayoutComponent {}
