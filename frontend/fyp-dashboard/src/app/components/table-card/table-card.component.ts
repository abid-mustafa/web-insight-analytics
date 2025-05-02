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

  // View state: table, line, or bar
  viewType: 'table' | 'pie' | 'bar' = 'table';
  chartType: ChartType = 'pie';
  chartData?: ChartConfiguration['data'];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#1A2A40' } }
    },
    scales: {
      x: { ticks: { color: '#1A2A40' }, grid: { color: 'rgba(0,0,0,0.1)' } },
      y: { ticks: { color: '#1A2A40' }, grid: { color: 'rgba(0,0,0,0.1)' } }
    }
  };

  constructor(private apiService: ApiService) {}

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
        const rows = result.data.result || [];
        const applyResult = () => {
          this.displayedColumns = rows.length ? Object.keys(rows[0]) : [];
          this.dataSource.data = rows;
          this.length = result.data.total.total ?? rows.length;
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
    if (
      this.viewType === 'table' ||
      !this.dataSource.data.length ||
      this.displayedColumns.length < 2
    ) {
      return;
    }
    const labelKey = this.displayedColumns[0];
    const valueKey = this.displayedColumns[1];
    const labels = this.dataSource.data.map(row => row[labelKey]);
    const values = this.dataSource.data.map(row => row[valueKey]);

    this.chartData = {
      labels,
      datasets: [
        {
          data: values,
          label: valueKey,
          borderColor: 'blue',
          backgroundColor:
            this.chartType === 'bar'
              ? 'rgba(0,0,255,0.6)'
              : 'rgba(0,0,255,0.0)',
          fill: this.chartType === 'bar'
        }
      ]
    };
  }
}
