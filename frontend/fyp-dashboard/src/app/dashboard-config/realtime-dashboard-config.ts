import { DashboardGridItem } from './dashboard-grid-item.interface';
import { DISPLAY_TYPES, EVENT_TYPES, TITLES } from './constants';

export const realtimeDashboard: DashboardGridItem[] = [
  {
    title: TITLES.LIVE_SESSIONS,
    event: EVENT_TYPES.SESSIONS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_PAGEVIEWS,
    event: EVENT_TYPES.PAGEVIEWS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_EVENTS,
    event: EVENT_TYPES.EVENTS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_VISITORS,
    event: EVENT_TYPES.VISITORS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
];
