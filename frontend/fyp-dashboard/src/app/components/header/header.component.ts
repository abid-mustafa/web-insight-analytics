import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter<void>();
  userName: string | null = null;
  userEmail: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.setUserDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setUserDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || null;
    this.userEmail = user.email || null;
  }


  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateToForm(): void {
    this.router.navigate(['/website-form']);
  }

  navigateToWebsiteManager(): void {
    this.router.navigate(['/manage-websites']);
  }
}