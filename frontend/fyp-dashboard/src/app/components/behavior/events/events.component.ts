import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';
import { Subject, takeUntil } from 'rxjs';
import { DashboardGridItem } from '../../dashboard-config/dashboard-grid-item.interface';
import { eventsDashboard } from '../../dashboard-config/events-dashboard.config';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  items: DashboardGridItem[] = eventsDashboard;

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