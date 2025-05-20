import { ENDPOINTS, TITLES, DISPLAY_TYPES } from "./constants";
import { DashboardGridItem } from "./dashboard-grid-item.interface";

export const eventsDashboard: DashboardGridItem[] = [
    {
        endpoint: ENDPOINTS.EVENTS_GROUPED,
        title: TITLES.EVENTS_BY_NAME,
        groupBy: 'name',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.EVENTS_GROUPED,
        title: TITLES.EVENTS_BY_URL,
        groupBy: 'url',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.EVENTS_GROUPED,
        title: TITLES.EVENTS_BY_DATE,
        groupBy: 'date',
        displayType: DISPLAY_TYPES.TABLE,
    },
];