import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

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
