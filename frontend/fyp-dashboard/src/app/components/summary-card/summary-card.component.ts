import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { WebsiteService } from '../../services/website.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() endpoint!: string;
  @Input() title!: string;
  @Input() toDate!: string;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  isLoading = false;
  chartData?: ChartConfiguration['data'];
  public chartType: ChartType = 'line';

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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
    plugins: {
      legend: { labels: { color: '#1A2A40' } },
    },
  };

  private needsResize = false;
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
        this.chartData = undefined;
        if (id) {
          this.fetchData();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['toDate'] &&
      !changes['toDate'].firstChange &&
      this.currentWebsiteId
    ) {
      this.fetchData();
    }
  }

  ngAfterViewInit(): void {
    this.needsResize = true;
  }

  ngAfterViewChecked(): void {
    if (this.needsResize) {
      this.needsResize = false;
      setTimeout(() => this.chart?.update(), 0);
    }
  }

  private fetchData(): void {
    if (!this.currentWebsiteId) {
      console.error('Website ID missing or not authenticated');
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    this.apiService
      .fetchSummaryData(
        this.currentWebsiteId,
        this.endpoint,
        this.toDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          const data = result.data;
          if (data?.users) {
            const labels = data.users.map((u: any) =>
              new Date(u.day).toLocaleDateString()
            );
            this.chartData = {
              labels,
              datasets: [
                {
                  data: data.users.map((u: any) => u.users),
                  label: 'Users',
                  borderColor: 'red',
                  backgroundColor: 'rgba(255, 0, 0, 0.6)',
                },
                {
                  data: data.views.map((v: any) => v.views),
                  label: 'Views',
                  borderColor: 'blue',
                  backgroundColor: 'rgba(0, 0, 255, 0.6)',
                },
                {
                  data: data.events.map((e: any) => e.events),
                  label: 'Events',
                  borderColor: 'orange',
                  backgroundColor: 'rgba(255, 165, 0, 0.6)',
                },
                {
                  data: data.sessions.map((s: any) => s.sessions),
                  label: 'Sessions',
                  borderColor: 'green',
                  backgroundColor: 'rgba(0, 128, 0, 0.6)',
                },
              ],
            };
            this.needsResize = true;
          }
        },
        error: (err: any) => {
          console.error('Error fetching summary data', err);
          this.isLoading = false;
        },
      });
  }

  public toggleChart(): void {
    this.chartType = this.chartType === 'line' ? 'bar' : 'line';
    this.needsResize = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
