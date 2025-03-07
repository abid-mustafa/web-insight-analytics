import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ApiService } from '../../services/api.service';  // Adjust the path if necessary

interface DashboardGridItem extends GridsterItem {
  endpoint: string;
  data?: any;  // Stores fetched API data
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  options: GridsterConfig;
  dashboard: DashboardGridItem[];
  fromDate: Date;
  toDate: Date;

  constructor(private apiService: ApiService) {
    this.options = {
      draggable: { enabled: true },
      resizable: { enabled: false },
      swap: true,
      pushItems: false,
      disableWindowResize: false,
      gridType: 'verticalFixed',
      fixedRowHeight: 450,
      displayGrid: 'onDrag&Resize',
      margin: 10,
      minCols: 3,
      maxCols: 3,
      minRows: 3,
      maxRows: 3,
      compactType: 'none',
    };

    // Initialize default date range
    this.fromDate = new Date('2024-10-01');
    this.toDate = new Date('2024-10-07');

    // Dashboard widgets with API endpoints
    this.dashboard = [
      { cols: 1, rows: 1, x: 0, y: 0, endpoint: 'events/event-count-by-event-category' },
      { cols: 1, rows: 1, x: 1, y: 0, endpoint: 'events/event-count-by-event-name' },
      { cols: 1, rows: 1, x: 2, y: 0, endpoint: 'events/event-count-by-event-label' },
      { cols: 1, rows: 1, x: 0, y: 1, endpoint: 'events/active-users-by-event-name' },
      { cols: 1, rows: 1, x: 1, y: 1, endpoint: 'pages/views-by-page-title' },
      { cols: 1, rows: 1, x: 2, y: 1, endpoint: 'pages/users-by-page-title' },
      { cols: 1, rows: 1, x: 0, y: 2, endpoint: 'users/users-by-country' },
      { cols: 1, rows: 1, x: 1, y: 2, endpoint: 'users/users-by-city' },
      { cols: 1, rows: 1, x: 2, y: 2, endpoint: 'users/users-by-device-type' }
    ];
  }

  onDateChange(): void {
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.toDate = this.fromDate;  // Ensure 'Up To' date is never before 'From' date
    }
  }
}
