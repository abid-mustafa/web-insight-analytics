import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { DashboardGridItem } from './dashboard-grid-item.interface';
import { Observable, of } from 'rxjs';
import { cardMap } from '../dashboard-config/card-config';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: DashboardGridItem[] = [];
  availableCards = cardMap;
  selectedCard: string | null = null;
  cardOptions$: Observable<string[]>;
  private readonly MAX_CARDS_PER_ROW = 3;
  private readonly BASE_COL_WIDTH = 300;
  private readonly BASE_ROW_HEIGHT = 200;
  private readonly STORAGE_KEY = 'custom_dashboard_layout';
  private readonly GRID_MARGIN = 16;

  constructor() {
    this.cardOptions$ = of(Object.keys(this.availableCards));
  }

  ngOnInit() {
    this.loadDashboardState();
    this.updateGridOptions();
  }

  private loadDashboardState() {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Validate that the saved state contains valid card configurations
        this.dashboard = parsedState.filter((item: DashboardGridItem) => {
          const baseCard = this.availableCards[item.title];
          return baseCard && item.endpoint === baseCard.endpoint;
        }).map((item: DashboardGridItem) => ({
          ...item,
          // Ensure all required properties are present
          cols: item.cols || 1,
          rows: item.rows || 2,
          x: item.x || 0,
          y: item.y || 0,
          displayType: item.displayType || this.availableCards[item.title].displayType,
          groupBy: item.groupBy || this.availableCards[item.title].groupBy
        }));
      } catch (error) {
        console.error('Error loading dashboard state:', error);
        this.dashboard = [];
      }
    }
  }

  private saveDashboardState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.dashboard));
    } catch (error) {
      console.error('Error saving dashboard state:', error);
    }
  }

  private updateGridOptions() {
    this.options = {
      draggable: { enabled: true },
      resizable: { enabled: true },
      pushItems: true, // Enable pushing items to prevent overlapping
      minCols: 1,
      minRows: 1,
      maxCols: this.MAX_CARDS_PER_ROW, // Maximum 3 columns
      maxRows: 6,
      margin: this.GRID_MARGIN,
      outerMargin: true,
      gridType: 'fixed',
      displayGrid: 'always',
      fixedColWidth: this.BASE_COL_WIDTH,
      fixedRowHeight: this.BASE_ROW_HEIGHT,
      rowHeight: this.BASE_ROW_HEIGHT,
      minItemCols: 1,
      minItemRows: 1,
      maxItemCols: 1, // Each card takes exactly 1 column
      maxItemRows: 6,
      defaultItemCols: 1, // Each card takes exactly 1 column
      defaultItemRows: 2,
      defaultItemX: 0,
      defaultItemY: 0,
      itemChangeCallback: (item: GridsterItem) => {
        const itemTitle = (item as any)['title'];
        // Force items to stay at 1 column width
        item.cols = 1;
        if (item.rows !== this.availableCards[itemTitle]?.rows) {
          item.rows = this.availableCards[itemTitle]?.rows || 2;
        }
        this.saveDashboardState();
      },
      itemResizeCallback: (item: GridsterItem) => {
        const itemTitle = (item as any)['title'];
        // Force items to stay at 1 column width
        item.cols = 1;
        if (item.rows !== this.availableCards[itemTitle]?.rows) {
          item.rows = this.availableCards[itemTitle]?.rows || 2;
        }
        this.saveDashboardState();
      }
    };
  }

  addSelectedCard() {
    if (this.selectedCard && this.availableCards[this.selectedCard]) {
      const card = this.availableCards[this.selectedCard];
      if (card.endpoint) {
        const newCard = {
          ...card,
          x: 0,
          y: 0
        };
        this.dashboard.push(newCard);
        this.selectedCard = null;
        this.updateGridOptions();
        this.saveDashboardState(); // Save state when adding a card
      }
    }
  }

  removeItem(item: GridsterItem) {
    const index = this.dashboard.indexOf(item as DashboardGridItem);
    if (index > -1) {
      this.dashboard.splice(index, 1);
      this.updateGridOptions();
      this.saveDashboardState(); // Save state when removing a card
    }
  }
}
