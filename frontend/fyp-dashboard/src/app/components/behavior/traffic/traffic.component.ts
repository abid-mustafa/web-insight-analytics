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
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss'],
})
export class TrafficComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  trafficTables: TableConfig[] = [
    {
      title: 'Traffic by Source',
      endpoint: 'traffic/grouped',
      groupBy: 'source'
    },
    {
      title: 'Traffic by Medium',
      endpoint: 'traffic/grouped',
      groupBy: 'medium'
    },
    {
      title: 'Traffic by Campaign',
      endpoint: 'traffic/grouped',
      groupBy: 'campaign'
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