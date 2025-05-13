import { ENDPOINTS, TITLES, DISPLAY_TYPES } from "./constants";
import { DashboardGridItem } from "./dashboard-grid-item.interface";

export const cardMap: Record<string, DashboardGridItem> = {
  'Overview Summary': {
    cols: 2,
    rows: 1,
    x: 0,
    y: 0,
    endpoint: ENDPOINTS.OVERVIEW,
    title: TITLES.OVERVIEW,
    displayType: DISPLAY_TYPES.SUMMARY,
  },
  'Events by Name': {
    cols: 1,
    rows: 1,
    x: 1,
    y: 1,
    endpoint: ENDPOINTS.EVENTS_GROUPED,
    title: TITLES.EVENTS_BY_NAME,
    groupBy: 'name',
    displayType: DISPLAY_TYPES.TABLE,
  },
};
