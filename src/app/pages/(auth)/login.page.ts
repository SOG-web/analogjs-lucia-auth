import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AppService } from "../../services/app.service";

@Component({
  standalone: true,
  template: ` <h1>Auth Login</h1>
    <form
      [formGroup]="loginForm"
      (ngSubmit)="login()"
      class="mt-4 flex flex-col gap-4"
    >
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        formControlName="email"
        class="h-5 p-4 rounded-lg !border !border-gray-500"
        placeholder="Email"
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        formControlName="password"
        class="h-5 p-4 rounded-lg !border !border-gray-500"
        placeholder="Password"
      />

      <button
        type="submit"
        [disabled]="!loginForm.valid"
        class="bg-blue-500 text-white p-4 rounded-lg"
      >
        Login
      </button>
    </form>`,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export default class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  appService = inject(AppService);

  constructor() {}

  login() {
    if (this.loginForm.valid) {
      this.appService.login(
        this.loginForm.value.email ?? "",
        this.loginForm.value.password ?? "",
      );
    }
  }
}
