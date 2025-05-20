import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DateRangeService, DateRange } from '../services/date-range.service';
import { AuthService } from '../services/auth.service';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @Output() toggleSidebar = new EventEmitter<void>();

  showLayout: boolean = true;
  userName: string | null = null;
  userEmail: string | null = null;
  websites: any[] = [];
  selectedWebsite: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private dateRangeService: DateRangeService, private auth: AuthService, private router: Router, private websiteService: WebsiteService) {
    this.router.events
      .pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe((e) => {
        this.showLayout = !['/login', '/register'].includes(e.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    this.setUserDetails();
    this.setWebsiteSelection();

    const { start, end } = this.dateRangeService.getCurrentRange();

    if (!start || !end) {
      const today = new Date();
      const defaultStart = new Date(today);
      defaultStart.setDate(today.getDate() - 7);
      defaultStart.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);

      this.dateRangeService.setRange({ start: defaultStart, end: today });
      localStorage.setItem('startDate', defaultStart.toISOString());
      localStorage.setItem('endDate', today.toISOString());
      this.range.setValue({ start: defaultStart, end: today });
    } else {
      this.range.setValue({ start, end });
    }

    this.range.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      const { start, end } = val;
      if (start && end) {
        const normalizedStart = new Date(start);
        const normalizedEnd = new Date(end);
        normalizedStart.setHours(0, 0, 0, 0);
        normalizedEnd.setHours(23, 59, 59, 999);

        if (normalizedStart > normalizedEnd) {
          this.range.setErrors({ invalidRange: true });
          return;
        }

        localStorage.setItem('startDate', normalizedStart.toISOString());
        localStorage.setItem('endDate', normalizedEnd.toISOString());
        this.dateRangeService.setRange({ start: normalizedStart, end: normalizedEnd });
      } else {
        this.range.setErrors({ invalidRange: true });
      }
    });

    this.loadWebsites();
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

  private setWebsiteSelection(): void {
    const uid = JSON.parse(localStorage.getItem('websiteUid') || 'null');
    if (uid) {
      this.selectedWebsite = uid;
      this.websiteService.setSelectedWebsite(uid);
    }
  }

  private loadWebsites(): void {
    this.websiteService.getWebsites().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : res.data;
        this.websites = Array.isArray(arr) ? arr : [];

        const localWebsiteUid = JSON.parse(localStorage.getItem('websiteUid') || 'null');
        const matchedWebsite = this.websites.find(w => w.website_id === localWebsiteUid);

        if (matchedWebsite) {
          this.onWebsiteChange(matchedWebsite.website_id);
        } else if (this.websites.length) {
          this.onWebsiteChange(this.websites[0].website_id);
        }
      },
    });
  }

  onWebsiteChange(websiteId: string): void {
    this.selectedWebsite = websiteId;
    this.websiteService.setSelectedWebsite(websiteId);
    localStorage.setItem('websiteUid', JSON.stringify(websiteId));
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

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
    });
  }
}