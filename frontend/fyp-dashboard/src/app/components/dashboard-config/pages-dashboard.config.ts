import { DashboardGridItem } from './dashboard-grid-item.interface';
import { DISPLAY_TYPES, ENDPOINTS, TITLES } from './constants';

export const pagesDashboard: DashboardGridItem[] = [
    {
        endpoint: ENDPOINTS.PAGES_GROUPED,
        title: TITLES.PAGES_BY_TITLE,
        groupBy: 'title',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.PAGES_GROUPED,
        title: TITLES.PAGES_BY_URL,
        groupBy: 'url',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.PAGES_GROUPED,
        title: TITLES.PAGES_BY_REFERRER,
        groupBy: 'referrer',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.PAGES_GROUPED,
        title: TITLES.PAGES_BY_DATE,
        groupBy: 'date',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.TOP_EXIT_PAGES,
        title: TITLES.TOP_EXIT_PAGES,
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.TOP_LANDING_PAGES,
        title: TITLES.TOP_LANDING_PAGES,
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.UNIQUE_PAGE_VIEWS,
        title: TITLES.UNIQUE_PAGE_VIEWS,
        displayType: DISPLAY_TYPES.SINGLE,
    },
    {
        endpoint: ENDPOINTS.AVG_TIME_ON_PAGE,
        title: TITLES.AVG_TIME_ON_PAGE,
        displayType: DISPLAY_TYPES.SINGLE,
    },
    {
        endpoint: ENDPOINTS.AVG_PAGEVIEWS_PER_SESSION,
        title: TITLES.AVG_PAGEVIEWS_PER_SESSION,
        displayType: DISPLAY_TYPES.SINGLE,
    },
    {
        endpoint: ENDPOINTS.BOUNCE_RATE,
        title: TITLES.BOUNCE_RATE,
        displayType: DISPLAY_TYPES.SINGLE,
    },
    {
        endpoint: ENDPOINTS.BOUNCE_RATE_BY_TITLE,
        title: TITLES.BOUNCE_RATE_BY_TITLE,
        displayType: DISPLAY_TYPES.TABLE,
    },
];
