import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, } from 'angular-gridster2';

interface DashboardGridItem extends GridsterItem {
  endpoint: string;
  title: string;
  displayType: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  options: GridsterConfig = [];
  dashboard: DashboardGridItem[] = [];

  dateRange: { fromDate: string, toDate: string } = { fromDate: '2020-11-01', toDate: '2020-11-02' };

  ngOnInit() {
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.OnDragAndResize,
      draggable: {
        enabled: true,
      },
      itemChangeCallback: this.onItemChange.bind(this),
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0, endpoint: 'summary/by-day', title: 'Overview Summary', displayType: 'summary' },
      { cols: 1, rows: 1, y: 1, x: 0, endpoint: 'pages/by-title', title: 'Views by Title', displayType: 'table' },
      { cols: 1, rows: 1, y: 1, x: 1, endpoint: 'events/by-name', title: 'Events by Name', displayType: 'table' },
      { cols: 1, rows: 1, y: 1, x: 2, endpoint: 'visitors/by-country', title: 'Visitors by Country', displayType: 'table' },
      { cols: 1, rows: 1, y: 2, x: 0, endpoint: 'ecommerce/items/by-name', title: 'Item Sold by Name', displayType: 'table' },
      { cols: 1, rows: 1, y: 2, x: 1, endpoint: 'traffic/by-source', title: 'Sessions by Source', displayType: 'table' },
    ];
  }

  onItemChange() {
    this.saveDashboard();
  }

  removeItem(item: DashboardGridItem) {
    console.log(item);

    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  saveDashboard() {
    localStorage.setItem('dashboardConfig', JSON.stringify(this.dashboard));
  }
}