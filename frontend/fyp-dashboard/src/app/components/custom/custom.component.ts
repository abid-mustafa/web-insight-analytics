import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { cardMap } from '../../dashboard-config/card-config';
import { DateRangeService } from '../../services/date-range.service';
import { FormControl } from '@angular/forms';
import { DashboardGridsterItem } from '../../dashboard-config/dashboard-gridster-item.interface';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit, OnDestroy {
  options!: GridsterConfig;
  dashboard: DashboardGridsterItem[] = [];
  availableCards = cardMap;
  selectedCard: string | null = null;
  cardOptions$!: Observable<{ value: string, disabled: boolean }[]>;
  filteredCardOptions$!: Observable<{ value: string, disabled: boolean }[]>;
  searchControl = new FormControl('');
  private readonly MAX_CARDS_PER_ROW = 6;
  private readonly BASE_COL_WIDTH = 175;
  private readonly BASE_ROW_HEIGHT = 200;
  private readonly STORAGE_KEY = 'custom_dashboard_layout';
  private readonly GRID_MARGIN = 16;
  private destroy$ = new Subject<void>();

  fromDate!: string;
  toDate!: string;

  constructor(private dateRangeService: DateRangeService) {
  }

  displayFn = (value: string): string => {
    return value || '';
  }

  ngOnInit() {
    this.cardOptions$ = of(this.getSortedCardOptions());
    this.filteredCardOptions$ = combineLatest([
      this.cardOptions$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([options, searchTerm]) => {
        if (!searchTerm) return options;
        const term = searchTerm.toLowerCase();
        return options.filter(option =>
          option.value.toLowerCase().includes(term)
        );
      })
    );

    // Subscribe to search control changes to update selectedCard
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (typeof value === 'string') {
          this.selectedCard = value;
        }
      });

    this.loadDashboardState();
    this.updateGridOptions();

    // Subscribe to date range changes
    this.dateRangeService.range$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ start, end }) => {
        if (start && end) {
          this.fromDate = start.toISOString().split('T')[0];
          this.toDate = end.toISOString().split('T')[0];
        }
      });
  }

  private loadDashboardState() {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Validate that the saved state contains valid card configurations
        this.dashboard = parsedState.filter((item: DashboardGridsterItem) => {
          const baseCard = this.availableCards[item.title];
          return baseCard && item.endpoint === baseCard.endpoint;
        }).map((item: DashboardGridsterItem) => ({
          ...item,
          // Ensure all required properties are present with 2x2 default
          cols: item.cols || 2,
          rows: item.rows || 2,
          x: item.x || 0,
          y: item.y || 0,
          displayType: item.displayType || this.availableCards[item.title].displayType,
          groupBy: item.groupBy || this.availableCards[item.title].groupBy
        }));
        // Update card options after loading the state
        this.updateCardOptions();
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
      resizable: { enabled: false },
      pushItems: true,
      minCols: 1,
      minRows: 1,
      maxCols: this.MAX_CARDS_PER_ROW,
      maxRows: 6,
      margin: this.GRID_MARGIN,
      outerMargin: false,
      gridType: 'fixed',
      displayGrid: 'none',
      fixedColWidth: this.BASE_COL_WIDTH,
      fixedRowHeight: this.BASE_ROW_HEIGHT,
      rowHeight: this.BASE_ROW_HEIGHT,
      minItemCols: 1,
      minItemRows: 1,
      maxItemCols: this.MAX_CARDS_PER_ROW,
      maxItemRows: 6,
      defaultItemCols: 2,
      defaultItemRows: 2,
      defaultItemX: 0,
      defaultItemY: 0,
      itemChangeCallback: (item: GridsterItem) => {
        this.saveDashboardState();
      },
      itemResizeCallback: (item: GridsterItem) => {
        this.saveDashboardState();
      },
      compactUp: true,
      compactLeft: true,
      compactType: 'compactUp&Left'
    };
  }

  private getSortedCardOptions(): { value: string, disabled: boolean }[] {
    const usedCards = new Set(this.dashboard.map(item => item.title));
    const allOptions = Object.keys(this.availableCards);

    // Split into available and used cards
    const available = allOptions
      .filter(option => !usedCards.has(option))
      .map(option => ({ value: option, disabled: false }));

    const used = allOptions
      .filter(option => usedCards.has(option))
      .map(option => ({ value: option, disabled: true }));

    // Return combined array with used cards at the bottom
    return [...available, ...used];
  }

  private updateCardOptions() {
    this.cardOptions$ = of(this.getSortedCardOptions());
  }

  addSelectedCard() {
    if (this.selectedCard && this.availableCards[this.selectedCard]) {
      const card = this.availableCards[this.selectedCard];
      if (card.endpoint) {
        // Calculate the position for the new card
        const position = this.calculateNextPosition();

        const newCard = {
          ...card,
          cols: 2,
          rows: 2,
          x: position.x,
          y: position.y
        };
        this.dashboard.push(newCard);
        this.selectedCard = null;
        this.updateGridOptions();
        this.updateCardOptions();
        this.saveDashboardState();
      }
    }

    this.searchControl.setValue('');
    this.searchControl.updateValueAndValidity();
    this.selectedCard = null;
  }

  private calculateNextPosition(): { x: number, y: number } {
    if (this.dashboard.length === 0) {
      return { x: 0, y: 0 };
    }

    // Sort cards by position (top to bottom, left to right)
    const sortedCards = [...this.dashboard].sort((a, b) => {
      if (a?.y === b?.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    // Find the last card
    const lastCard = sortedCards[sortedCards.length - 1];

    // Calculate next position
    let nextX = lastCard.x + lastCard.cols;
    let nextY = lastCard.y;

    // If next position would exceed max columns, move to next row
    if (nextX + 2 > this.MAX_CARDS_PER_ROW) {
      nextX = 0;
      nextY = lastCard.y + lastCard.rows;
    }

    return { x: nextX, y: nextY };
  }

  removeItem(item: GridsterItem) {
    const index = this.dashboard.indexOf(item as DashboardGridsterItem);
    if (index > -1) {
      // Remove the item
      this.dashboard.splice(index, 1);

      // Force a reflow of the grid
      setTimeout(() => {
        this.dashboard = [...this.dashboard];
        this.updateGridOptions();
        this.updateCardOptions();
        this.saveDashboardState();
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
