import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.auth.login({ email, password }).subscribe({
      next: (data: any) => {
        console.log(data);
        console.log(data.success);
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigate(['/manage-websites']);
        }
      },
      error: (err) =>
        (this.errorMessage = err.error?.message || 'Invalid credentials'),
    });
  }

  back(): void {
    this.router.navigate(['/register']);
  }
}