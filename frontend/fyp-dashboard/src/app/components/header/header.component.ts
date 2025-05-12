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
    // Hide header on login/register routes
    this.router.events
      .pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showLayout = !['/login', '/register'].includes(e.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    // Load user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user?.name ?? null;
    this.userEmail = user?.email ?? null;

    console.log(user);


    // Watch date-range picker and broadcast changes
    this.range.valueChanges.subscribe((val: Partial<DateRange>) => {
      const { start, end } = val;
      if (start && end) {
        this.dateRangeService.setRange({ start, end });
      } else {
        this.range.setErrors({ invalidRange: true });
      }
    });

    // Fetch websites and select the first one by default
    this.loadWebsites();
  }

  private loadWebsites(): void {
    this.websiteService.getWebsites().subscribe({
      next: (res: any) => {
        // if API returns { data: [...] }, unwrap; otherwise assume it's already an array
        const arr = Array.isArray(res) ? res : res.data;
        this.websites = Array.isArray(arr) ? arr : [];

        if (this.websites.length) {
          const firstId = this.websites[0].website_id;
          this.onWebsiteChange(firstId);
        }
      },
      error: (err) => console.error('Failed to load websites', err),
    });
  }

  onWebsiteChange(websiteId: number): void {
    this.selectedWebsite = websiteId;
    this.websiteService.setSelectedWebsite(websiteId);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  selectPreset(preset: string): void {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (preset) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'last7':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 6);
        break;
      case 'last30':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 29);
        break;
      case 'thisMonth':
        end = new Date();
        start = new Date(end.getFullYear(), end.getMonth(), 1);
        break;
      case 'lastMonth':
        const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        start = new Date(prev.getFullYear(), prev.getMonth(), 1);
        end = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
        break;
      default:
        return;
    }

    this.range.setValue({ start, end });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
