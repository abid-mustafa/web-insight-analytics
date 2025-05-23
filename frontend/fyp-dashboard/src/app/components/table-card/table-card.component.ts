import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { WebsiteService } from '../../services/website.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
})
export class TableCardComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() endpoint!: string;
  @Input() title!: string;
  @Input() fromDate!: string;
  @Input() toDate!: string;
  @Input() groupBy!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Table state
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  pageIndex = 0;
  pageSize = 5;
  length = 0;
  isLoading = false;

  // Chart state
  viewType: 'table' | 'pie' | 'bar' = 'table';
  chartType: ChartType = 'pie';
  chartData?: ChartConfiguration['data'];
  private originalLabels: string[] = [];

  // Tracks selected website
  private currentWebsiteId: string | null = null;

  // For unsubscribing
  private destroy$ = new Subject<void>();

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,  // Hide legend for bar charts
        labels: { color: '#1A2A40' }
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex;
            return this.originalLabels[idx] || '';
          },
          label: (item) => `${item.dataset.label}: ${item.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#1A2A40' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
      y: {
        ticks: { color: '#1A2A40' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
    },
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#1A2A40' } },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex;
            return this.originalLabels[idx] || '';
          },
          label: (item) => `${item.dataset.label}: ${item.formattedValue}`,
        },
      },
    },
    scales: {},
  };

  constructor(
    private apiService: ApiService,
    private websiteService: WebsiteService
  ) { }

  ngOnInit(): void {
    // Listen for website changes
    this.websiteService.selectedWebsite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.currentWebsiteId = id;
        // clear out old data
        this.dataSource.data = [];
        this.length = 0;
        this.pageIndex = 0;
        if (id) {
          this.fetchData();
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if date range changes, reset page and re-fetch
    if (
      (changes['fromDate'] && !changes['fromDate'].firstChange) ||
      (changes['toDate'] && !changes['toDate'].firstChange)
    ) {
      this.pageIndex = 0;
      this.fetchData();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.fetchData();
  }

  setView(view: 'table' | 'pie' | 'bar'): void {
    this.viewType = view;
    this.chartType = view === 'bar' ? 'bar' : 'pie';
    this.prepareChartData();
  }

  private fetchData(): void {
    if (!this.currentWebsiteId) {
      console.error('Website ID missing or not authenticated');
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    this.apiService
      .fetchTableData(
        this.currentWebsiteId,
        this.endpoint,
        this.fromDate,
        this.toDate,
        this.pageIndex * this.pageSize,
        this.pageSize,
        this.groupBy
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result.success) {
            const rows = result.data.values || [];
            this.displayedColumns = rows.length
              ? Object.keys(rows[0])
              : [];
            this.dataSource.data = rows;
            this.length = result.data.total ?? rows.length;
            this.prepareChartData();
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private prepareChartData(): void {
    if (
      this.viewType === 'table' ||
      !this.dataSource.data.length ||
      this.displayedColumns.length < 2
    ) {
      return;
    }

    const labelKey = this.displayedColumns[0];
    const valueKey = this.displayedColumns[1];
    const rawLabels = this.dataSource.data.map((row) => row[labelKey]);
    this.originalLabels = rawLabels;

    const labels = rawLabels.map((l) =>
      this.viewType === 'bar' && l.length > 12 ? `${l.slice(0, 12)}…` : l
    );
    const values = this.dataSource.data.map((row) => row[valueKey]);

    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];
    const borderColors = backgroundColors.map((c) => c.replace('0.6', '1'));

    const ds: any = {
      label: valueKey,
      data: values,
      labels,
      backgroundColor: backgroundColors.slice(0, values.length),
      borderColor: borderColors.slice(0, values.length),
      borderWidth: 1,
    };

    if (this.viewType === 'pie') {
      ds.radius = '75%';
      ds.hoverOffset = 4;
    }

    this.chartData = { labels, datasets: [ds] };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
