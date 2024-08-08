import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "admin-home",
  imports: [],
  template: `
    <h1>Admin main</h1>
    <button (click)="logout()">Logout</button>
  `,
})
export default class AdminComponent {
  http = inject(HttpClient);
  router = inject(Router);

  logout() {
    this.http.post("/api/auth/logout", {}).subscribe(() => {
      this.router.navigateByUrl("/login");
    });
  }
}
