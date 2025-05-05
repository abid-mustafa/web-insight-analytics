import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent implements AfterViewInit, OnChanges {
  @Input() endpoint!: string;
  @Input() title!: string;
  @Input() fromDate: string = '2020-11-01';
  @Input() toDate: string = '2021-11-02';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Table Data
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  pageIndex = 0;
  pageSize = 5;
  length = 0;
  isLoading = false;

  // View state: table, pie, or bar
  viewType: 'table' | 'pie' | 'bar' = 'table';
  chartType: ChartType = 'pie';
  chartData?: ChartConfiguration['data'];

  // Keep full labels for tooltip display
  private originalLabels: string[] = [];

  // Chart options for bar/line charts (with grid + full-text tooltip)
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#1A2A40' } },
      tooltip: {
        callbacks: {
          // show full label on hover
          title: (items) => {
            const idx = items[0].dataIndex;
            return this.originalLabels[idx] || '';
          },
          label: (item) => {
            return `${item.dataset.label}: ${item.formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#1A2A40' },
        grid: { color: 'rgba(0,0,0,0.1)' }
      },
      y: {
        ticks: { color: '#1A2A40' },
        grid: { color: 'rgba(0,0,0,0.1)' }
      }
    }
  };

  // Chart options for pie charts (no grid + full-text tooltip)
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
          label: (item) => {
            return `${item.dataset.label}: ${item.formattedValue}`;
          }
        }
      }
    },
    scales: {}
  };

  constructor(private apiService: ApiService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromDate'] || changes['toDate']) {
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
    this.isLoading = true;
    const startTime = Date.now();

    this.apiService.fetchTableData(
      this.endpoint,
      this.fromDate,
      this.toDate,
      this.pageIndex * this.pageSize
    ).subscribe({
      next: (result: any) => {
        const rows = result.data.values || [];
        const applyResult = () => {
          this.displayedColumns = rows.length ? Object.keys(rows[0]) : [];
          this.dataSource.data = rows;
          this.length = result.data.total ?? rows.length;
          this.prepareChartData();
          this.isLoading = false;
        };

        const elapsed = Date.now() - startTime;
        const remaining = 3000 - elapsed;
        if (remaining > 0) {
          setTimeout(applyResult, remaining);
        } else {
          applyResult();
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private prepareChartData(): void {
    // Only build chart data for non-table views with sufficient data
    if (
      this.viewType === 'table' ||
      !this.dataSource.data.length ||
      this.displayedColumns.length < 2
    ) {
      return;
    }

    const labelKey = this.displayedColumns[0];
    const valueKey = this.displayedColumns[1];

    // 1) grab raw full labels
    const rawLabels: string[] = this.dataSource.data.map(row => row[labelKey]);
    this.originalLabels = rawLabels;

    // 2) truncate labels to 12 chars in bar view
    const labels = rawLabels.map(l =>
      this.viewType === 'bar' && l.length > 12 ? `${l.slice(0, 12)}…` : l
    );

    const values = this.dataSource.data.map(row => row[valueKey]);

    // Define a palette for slices/bars
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)'
    ];
    const borderColors = backgroundColors.map(c => c.replace('0.6', '1'));

    // Build dataset
    const ds: any = {
      label: valueKey,
      data: values,
      labels,  // truncated or full labels go here
      backgroundColor: backgroundColors.slice(0, values.length),
      borderColor: borderColors.slice(0, values.length),
      borderWidth: 1
    };

    // If pie, reduce radius and add hover offset
    if (this.viewType === 'pie') {
      ds.radius = '75%';
      ds.hoverOffset = 4;
    }

    this.chartData = {
      labels,
      datasets: [ds]
    };
  }
}
