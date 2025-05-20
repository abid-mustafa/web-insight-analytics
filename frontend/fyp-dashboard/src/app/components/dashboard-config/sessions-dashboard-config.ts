import { ENDPOINTS, TITLES, DISPLAY_TYPES } from "./constants";
import { DashboardGridItem } from "./dashboard-grid-item.interface";

export const sessionsDashboard: DashboardGridItem[] = [
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_COUNTRY,
        groupBy: 'country',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_CITY,
        groupBy: 'city',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_BROWSER,
        groupBy: 'browser',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_OS,
        groupBy: 'os',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_DEVICE,
        groupBy: 'device',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_BY_SOURCE,
        title: TITLES.SESSIONS_BY_SOURCE,
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.SESSIONS_GROUPED,
        title: TITLES.SESSIONS_BY_DATE,
        groupBy: 'date',
        displayType: DISPLAY_TYPES.TABLE,
    },
];