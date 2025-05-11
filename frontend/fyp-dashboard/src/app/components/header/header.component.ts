import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DateRangeService, DateRange } from '../services/date-range.service';
import { AuthService } from '../services/auth.service';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @Output() toggleSidebar = new EventEmitter<void>();

  showLayout = true;
  userName: string | null = null;
  userEmail: string | null = null;

  websites: any[] = [];
  selectedWebsite: any = null;

  constructor(
    private dateRangeService: DateRangeService,
    private auth: AuthService,
    private router: Router,
    private websiteService: WebsiteService
  ) {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e) => {
        this.showLayout = !['/login', '/register'].includes(
          e.urlAfterRedirects
        );
      });
  }

  ngOnInit(): void {
    // pull user object out of localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user?.name ?? null;
    this.userEmail = user?.email ?? null; // ← populate it

    this.range.valueChanges.subscribe((val: Partial<DateRange>) => {
      const { start, end } = val;
      if (start && end) {
        this.dateRangeService.setRange({ start, end });
      }
    });
    this.getWebsites();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  getWebsites(): void {
    // fetch websites list
    this.websiteService.getWebsites().subscribe({
      next: (result: any) => (this.websites = result.data),
      error: (err) => console.error('Failed to load websites', err),
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}