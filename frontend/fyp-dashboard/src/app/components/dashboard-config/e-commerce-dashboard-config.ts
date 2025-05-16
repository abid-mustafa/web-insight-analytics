import { DashboardGridItem } from './dashboard-grid-item.interface';
import { ENDPOINTS, TITLES, EVENT_TYPES, DISPLAY_TYPES } from './constants';

export const ecommerceDashboard: DashboardGridItem[] = [
  {
    cols: 1,
    rows: 1,
    y: 0,
    x: 0,
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_CATEGORY,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'category',
  },
  {
    cols: 1,
    rows: 1,
    y: 0,
    x: 2,
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_ID,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'id',
  },
  {
    cols: 1,
    rows: 1,
    y: 0,
    x: 0,
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_NAME,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'name',
  },
];