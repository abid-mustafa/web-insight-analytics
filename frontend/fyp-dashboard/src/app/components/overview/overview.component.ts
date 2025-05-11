  import { Component, OnInit } from '@angular/core';
  import {
    DisplayGrid,
    GridsterConfig,
    GridsterItem,
    GridType,
  } from 'angular-gridster2';
  import { DateRangeService } from '../services/date-range.service';

  interface DashboardGridItem extends GridsterItem {
    endpoint: string;
    title: string;
    displayType: string;
    event?: string;
  }

  @Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
  })
  export class OverviewComponent implements OnInit {
    options!: GridsterConfig;
    dashboard: DashboardGridItem[] = [];

    // default dates
    dateRange = {
      fromDate: '2020-11-01',
      toDate: '2020-11-10',
    };

    constructor(private dateRangeService: DateRangeService) {}

    ngOnInit() {
      // 1) gridster setup
      this.options = {
        gridType: GridType.ScrollVertical,
        displayGrid: DisplayGrid.OnDragAndResize,
        draggable: { enabled: true },
        itemChangeCallback: this.onItemChange.bind(this),
      };

      // 2) initial dashboard layout
      this.dashboard = [
        {
          cols: 2,
          rows: 1,
          y: 0,
          x: 0,
          endpoint: 'summary/by-day',
          title: 'Overview Summary',
          displayType: 'summary',
        },
        {
          cols: 1,
          rows: 1,
          y: 0,
          x: 2,
          endpoint: 'realtime/pageviews',
          title: 'Pageviews',
          event: 'get_pageviews',
          displayType: 'realtime',
        },
        {
          cols: 1,
          rows: 1,
          y: 1,
          x: 0,
          endpoint: 'pages/by-title',
          title: 'Views by Title',
          displayType: 'table',
        },
        {
          cols: 1,
          rows: 1,
          y: 1,
          x: 1,
          endpoint: 'events/by-name',
          title: 'Events by Name',
          displayType: 'table',
        },
        {
          cols: 1,
          rows: 1,
          y: 1,
          x: 2,
          endpoint: 'visitors/by-country',
          title: 'Visitors by Country',
          displayType: 'table',
        },
        {
          cols: 1,
          rows: 1,
          y: 2,
          x: 0,
          endpoint: 'ecommerce/items/by-name',
          title: 'Item Sold by Name',
          displayType: 'table',
        },
        {
          cols: 1,
          rows: 1,
          y: 2,
          x: 1,
          endpoint: 'traffic/by-source',
          title: 'Sessions by Source',
          displayType: 'table',
        },
      ];

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