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
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  pageTables: TableConfig[] = [
    {
      title: 'Pages by Title',
      endpoint: 'pages/grouped',
      groupBy: 'title'
    },
    {
      title: 'Pages by URL',
      endpoint: 'pages/grouped',
      groupBy: 'url'
    },
    {
      title: 'Pages by Referrer',
      endpoint: 'pages/grouped',
      groupBy: 'referrer'
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