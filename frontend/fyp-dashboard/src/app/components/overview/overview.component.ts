import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateRangeService } from '../services/date-range.service';
import { Subject, takeUntil } from 'rxjs';
import { DashboardGridItem } from '../dashboard-config/dashboard-grid-item.interface';
import { overviewDashboard } from '../dashboard-config/overview-dashboard-config';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  dashboard: DashboardGridItem[] = overviewDashboard;

  private destroy$ = new Subject<void>();
  fromDate: string = '';
  toDate: string = '';

  constructor(private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    // Subscribe to date range changes
    this.dateRangeService.range$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ start, end }) => {
        if (start && end) {
          this.fromDate = start.toISOString().split('T')[0];
          this.toDate = end.toISOString().split('T')[0];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
