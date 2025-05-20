import { ENDPOINTS, TITLES, DISPLAY_TYPES } from "./constants";
import { DashboardGridItem } from "./dashboard-grid-item.interface";

export const visitorsDashboard: DashboardGridItem[] = [
    {
        endpoint: ENDPOINTS.VISITORS_GROUPED,
        title: TITLES.VISITORS_BY_COUNTRY,
        groupBy: 'country',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.VISITORS_GROUPED,
        title: TITLES.VISITORS_BY_CITY,
        groupBy: 'city',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.VISITORS_GROUPED,
        title: TITLES.VISITORS_BY_DEVICE,
        groupBy: 'device',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.VISITORS_GROUPED,
        title: TITLES.VISITORS_BY_OS,
        groupBy: 'os',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.VISITORS_GROUPED,
        title: TITLES.VISITORS_BY_BROWSER,
        groupBy: 'browser',
        displayType: DISPLAY_TYPES.TABLE,
    },
];