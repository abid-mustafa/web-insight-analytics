import { DashboardGridItem } from './dashboard-grid-item.interface';
import { DISPLAY_TYPES, ENDPOINTS, EVENT_TYPES, TITLES } from './constants';

const summarySection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.OVERVIEW,
    title: TITLES.OVERVIEW,
    displayType: DISPLAY_TYPES.SUMMARY,
  },
];

const realtimeSection: DashboardGridItem[] = [
  {
    title: TITLES.LIVE_SESSIONS,
    event: EVENT_TYPES.SESSIONS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_VISITORS,
    event: EVENT_TYPES.VISITORS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_EVENTS,
    event: EVENT_TYPES.EVENTS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
  {
    title: TITLES.LIVE_PAGEVIEWS,
    event: EVENT_TYPES.PAGEVIEWS,
    displayType: DISPLAY_TYPES.REALTIME,
  },
];

const pagesSection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.PAGES_GROUPED,
    title: TITLES.VIEWS_BY_TITLE,
    groupBy: 'title',
    displayType: DISPLAY_TYPES.TABLE,
  },
  {
    endpoint: ENDPOINTS.AVG_TIME_ON_PAGE,
    title: TITLES.AVG_TIME_ON_PAGE,
    displayType: DISPLAY_TYPES.SINGLE,
  },
  {
    endpoint: ENDPOINTS.UNIQUE_PAGE_VIEWS,
    title: TITLES.UNIQUE_PAGE_VIEWS,
    displayType: DISPLAY_TYPES.SINGLE,
  },
  {
    endpoint: ENDPOINTS.AVG_PAGEVIEWS_PER_SESSION,
    title: TITLES.AVG_PAGEVIEWS_PER_SESSION,
    displayType: DISPLAY_TYPES.SINGLE,
  },
  {
    endpoint: ENDPOINTS.TOP_LANDING_PAGES,
    title: TITLES.TOP_LANDING_PAGES,
    displayType: DISPLAY_TYPES.TABLE,
  },
  {
    endpoint: ENDPOINTS.BOUNCE_RATE_BY_TITLE,
    title: TITLES.BOUNCE_RATE_BY_TITLE,
    displayType: DISPLAY_TYPES.TABLE,
  },
  {
    endpoint: ENDPOINTS.TOP_EXIT_PAGES,
    title: TITLES.TOP_EXIT_PAGES,
    displayType: DISPLAY_TYPES.TABLE,
  },
];

const eventsSection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.EVENTS_GROUPED,
    title: TITLES.EVENTS_BY_NAME,
    groupBy: 'name',
    displayType: DISPLAY_TYPES.TABLE,
  },
];

const visitorsSection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.VISITORS_GROUPED,
    title: TITLES.VISITORS_BY_COUNTRY,
    groupBy: 'country',
    displayType: DISPLAY_TYPES.TABLE,
  },
];

const ecommerceSection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.ITEM_SOLD,
    title: TITLES.ITEM_SOLD_BY_NAME,
    groupBy: 'name',
    displayType: DISPLAY_TYPES.TABLE,
  },
];

const sessionsSection: DashboardGridItem[] = [
  {
    endpoint: ENDPOINTS.TRAFFIC_GROUPED,
    title: TITLES.SESSIONS_BY_SOURCE,
    groupBy: 'source',
    displayType: DISPLAY_TYPES.TABLE,
  },
  {
    endpoint: ENDPOINTS.BOUNCE_RATE,
    title: TITLES.BOUNCE_RATE,
    displayType: DISPLAY_TYPES.SINGLE,
  },
];

export const overviewDashboard: DashboardGridItem[] = [
  ...summarySection,
  ...realtimeSection,
  ...pagesSection,
  ...eventsSection,
  ...visitorsSection,
  ...ecommerceSection,
  ...sessionsSection,
];