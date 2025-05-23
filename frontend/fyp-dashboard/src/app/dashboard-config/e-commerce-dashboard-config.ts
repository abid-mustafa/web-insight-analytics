import { DashboardGridItem } from './dashboard-grid-item.interface';
import { ENDPOINTS, TITLES, DISPLAY_TYPES } from './constants';

export const ecommerceDashboard: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_CATEGORY,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'category',
  },
  {
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_ID,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'id',
  },
  {
    endpoint: ENDPOINTS.ITEMS_GROUPED,
    title: TITLES.ITEMS_BY_NAME,
    displayType: DISPLAY_TYPES.TABLE,
    groupBy: 'name',
  },
];