import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppService {
  http = inject(HttpClient);
  constructor() {}

  login(email: string, password: string) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    this.http.post("/api/auth/login", formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  signup(email: string, password: string) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    // console.log(formData);
    this.http.post("/api/auth/signup", formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
