import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { DateRangeService } from '../services/date-range.service';
import { DashboardGridItem } from '../dashboard-config/dashboard-grid-item.interface';
import { overviewDashboard } from '../dashboard-config/overview-dashboard-config';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: DashboardGridItem[] = overviewDashboard;

  // default dates
  dateRange = {
    fromDate: '2020-11-01',
    toDate: '2020-11-10',
  };

  constructor(private dateRangeService: DateRangeService) { }

  ngOnInit() {
    // 1) gridster setup
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.OnDragAndResize,
      draggable: { enabled: true },
      itemChangeCallback: this.onItemChange.bind(this),
    };

    // 2) initial dashboard layout
    this.dashboard = overviewDashboard;

    // 3) subscribe to header date changes
    this.dateRangeService.range$.subscribe(({ start, end }) => {
      if (start && end) {
        this.dateRange = {
          fromDate: start.toISOString().split('T')[0],
          toDate: end.toISOString().split('T')[0],
        };
      }
    });
  }

  onItemChange() {
    this.saveDashboard();
  }

  removeItem(item: DashboardGridItem) {
    const idx = this.dashboard.indexOf(item);
    if (idx > -1) {
      this.dashboard.splice(idx, 1);
      this.saveDashboard();
    }
  }

  saveDashboard() {
    localStorage.setItem('dashboardConfig', JSON.stringify(this.dashboard));
  }
}
