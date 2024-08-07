import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppService } from "./services/app.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  providers: [AppService],
  template: ` <router-outlet></router-outlet> `,
  styles: [
    `
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class AppComponent {}
