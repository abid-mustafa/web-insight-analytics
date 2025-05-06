import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked,
  ViewChild
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @Input() endpoint!: string;
  @Input() title!: string;
  @Input() toDate: string = '2020-11-08';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  isLoading = false;
  chartData!: ChartConfiguration['data'];
  public chartType: ChartType = 'line';

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom:90,
      }},
    scales: {
      x: {
        ticks: { color: '#1A2A40' },
        grid:  { color: 'rgba(0,0,0,0.1)' }
      },
      y: {
        ticks: { color: '#1A2A40' },
        grid:  { color: 'rgba(0,0,0,0.1)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#1A2A40' }
      }
    }
  };

  // Flag to trigger a one-time chart resize/redraw
  private needsResize = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toDate'] && !changes['toDate'].firstChange) {
      this.fetchData();
    }
  }

  ngAfterViewInit(): void {
    // Schedule the initial redraw once the view is rendered
    this.needsResize = true;
  }

  ngAfterViewChecked(): void {
    if (this.needsResize) {
      this.needsResize = false;
      // Defer update so container sizes are settled
      setTimeout(() => this.chart?.update(), 0);
    }
  }

  private fetchData(): void {
    this.isLoading = true;
    this.apiService.fetchSummaryData(this.endpoint, this.toDate)
      .subscribe({
        next: (result: any) => {
          const data = result.data;
          if (data && data.users) {
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
                  backgroundColor: 'rgba(255, 0, 0, 0.6)'
                },
                {
                  data: data.views.map((v: any) => v.views),
                  label: 'Views',
                  borderColor: 'blue',
                  backgroundColor: 'rgba(0, 0, 255, 0.6)'
                },
                {
                  data: data.events.map((e: any) => e.events),
                  label: 'Events',
                  borderColor: 'orange',
                  backgroundColor: 'rgba(255, 165, 0, 0.6)'
                },
                {
                  data: data.sessions.map((s: any) => s.sessions),
                  label: 'Sessions',
                  borderColor: 'green',
                  backgroundColor: 'rgba(0, 128, 0, 0.6)'
                }
              ]
            };

            // After new data is set, schedule a redraw
            this.needsResize = true;
          }
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error fetching summary data', err);
          this.isLoading = false;
        }
      });
  }

  /** Toggle between line and bar and schedule a redraw */
  public toggleChart(): void {
    this.chartType = this.chartType === 'line' ? 'bar' : 'line';
    this.needsResize = true;
  }
}
