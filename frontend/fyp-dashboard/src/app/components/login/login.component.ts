import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) { }

  login() {
    // TODO: hook up real auth
    console.log('Logging in', this.email, this.password);
    this.router.navigate(['/dashboard']); // or wherever
  }
}
