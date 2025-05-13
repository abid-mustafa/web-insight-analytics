import { GridsterItem } from "angular-gridster2";

export interface DashboardGridItem extends GridsterItem {
  endpoint?: string;
  title: string;
  displayType: string;
  event?: string;
  groupBy?: string;
}