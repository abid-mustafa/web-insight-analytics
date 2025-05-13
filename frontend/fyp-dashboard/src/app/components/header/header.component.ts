// src/app/components/header/header.component.ts
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
  selectedWebsite: number | null = null;

  constructor(
    private dateRangeService: DateRangeService,
    private auth: AuthService,
    private router: Router,
    private websiteService: WebsiteService
  ) {
    this.router.events
      .pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showLayout = !['/login', '/register'].includes(e.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user?.name ?? null;
    this.userEmail = user?.email ?? null;

    const { start, end } = this.dateRangeService['rangeSubject'].getValue();
    this.range.setValue({ start, end });
    this.range.valueChanges.subscribe((val: Partial<DateRange>) => {
      const { start, end } = val;
      if (start && end) {
        // Normalize dates to start and end of day
        const normalizedStart = new Date(start);
        normalizedStart.setHours(0, 0, 0, 0);
        
        const normalizedEnd = new Date(end);
        normalizedEnd.setHours(23, 59, 59, 999);

        // Validate dates
        if (normalizedStart > normalizedEnd) {
          this.range.setErrors({ invalidRange: true });
          return;
        }

        // Format dates consistently
        const formattedRange = {
          start: normalizedStart,
          end: normalizedEnd
        };

        this.dateRangeService.setRange(formattedRange);
      } else {
        this.range.setErrors({ invalidRange: true });
      }
    });

    this.loadWebsites();
  }

  private loadWebsites(): void {
    this.websiteService.getWebsites().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : res.data;
        this.websites = Array.isArray(arr) ? arr : [];
        if (this.websites.length) {
          this.onWebsiteChange(this.websites[0].website_id);
        }
      },
    });
  }

  onWebsiteChange(websiteId: number): void {
    this.selectedWebsite = websiteId;
    this.websiteService.setSelectedWebsite(websiteId);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateToForm(): void {
    this.router.navigate(['/website-form']).then(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  navigateToWebsiteManager(): void {
    this.router.navigate(['/manage-websites']).then(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  confirmLogout(): void {
    if (window.confirm('Are you sure you want to log out?')) {
      this.logout();
    }
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
