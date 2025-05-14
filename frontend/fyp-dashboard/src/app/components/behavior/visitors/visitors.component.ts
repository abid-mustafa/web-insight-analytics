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
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss'],
})
export class VisitorsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  visitorTables: TableConfig[] = [
    {
      title: 'Visitors by Country',
      endpoint: 'visitors/grouped',
      groupBy: 'country'
    },
    {
      title: 'Visitors by City',
      endpoint: 'visitors/grouped',
      groupBy: 'city'
    },
    {
      title: 'Visitors by Device',
      endpoint: 'visitors/grouped',
      groupBy: 'device'
    },
    {
      title: 'Visitors by OS',
      endpoint: 'visitors/grouped',
      groupBy: 'os'
    },
    {
      title: 'Visitors by Browser',
      endpoint: 'visitors/grouped',
      groupBy: 'browser'
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