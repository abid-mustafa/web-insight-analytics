import { ENDPOINTS, TITLES, DISPLAY_TYPES } from "./constants";

export const trafficDashboard = [
    {
        endpoint: ENDPOINTS.TRAFFIC_GROUPED,
        title: TITLES.TRAFFIC_BY_SOURCE,
        groupBy: 'source',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.TRAFFIC_GROUPED,
        title: TITLES.TRAFFIC_BY_MEDIUM,
        groupBy: 'medium',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.TRAFFIC_GROUPED,
        title: TITLES.TRAFFIC_BY_CAMPAIGN,
        groupBy: 'campaign',
        displayType: DISPLAY_TYPES.TABLE,
    },
    {
        endpoint: ENDPOINTS.TRAFFIC_GROUPED,
        title: TITLES.TRAFFIC_BY_DATE,
        groupBy: 'date',
        displayType: DISPLAY_TYPES.TABLE,
    },
]