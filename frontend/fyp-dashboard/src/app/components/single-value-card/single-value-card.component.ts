import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { WebsiteService } from '../../services/website.service';

@Component({
  selector: 'app-single-value-card',
  templateUrl: './single-value-card.component.html',
  styleUrl: './single-value-card.component.scss',
})
export class SingleValueCardComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input() endpoint!: string;
  @Input() fromDate!: string;
  @Input() toDate!: string;

  isLoading = false;
  value: number | null = null;
  private currentWebsiteId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private websiteService: WebsiteService
  ) { }

  ngOnInit(): void {
    this.websiteService.selectedWebsite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.currentWebsiteId = id;
        if (id) this.fetchData();
      });
  }

  private fetchData(): void {
    if (!this.currentWebsiteId) {
      console.error('Website ID missing or not authenticated');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.apiService
      .fetchSingleValueDate(
        this.currentWebsiteId,
        this.endpoint,
        this.fromDate,
        this.toDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          this.value = result.data;
        },
        error: (err: any) => {
          console.error('Error fetching single value data', err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}