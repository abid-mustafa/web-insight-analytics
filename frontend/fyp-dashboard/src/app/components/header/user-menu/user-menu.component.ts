import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  @Input() userName: string | null = null;
  @Input() userEmail: string | null = null;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  navigateToWebsiteManager(): void {
    this.router.navigate(['/manage-websites']).then(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  navigateToForm(): void {
    this.router.navigate(['/website-form']).then(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  confirmLogout(): void {
    if (window.confirm('Are you sure you want to log out?')) {
      this.logout();
    }
  }

  private logout(): void {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
} 