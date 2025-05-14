import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebsiteService } from '../../services/website.service';

interface TableConfig {
  title: string;
  endpoint: string;
  groupBy: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  eventTables: TableConfig[] = [
    {
      title: 'Events by Name',
      endpoint: 'events/grouped',
      groupBy: 'name'
    },
    {
      title: 'Events by URL',
      endpoint: 'events/grouped',
      groupBy: 'url'
    }
  ];

  fromDate = '';
  toDate = '';

  constructor(
    private dateRangeService: DateRangeService,
    private websiteService: WebsiteService
  ) {}

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