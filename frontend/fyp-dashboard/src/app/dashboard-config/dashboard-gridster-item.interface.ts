export interface DashboardGridsterItem {
  cols: number;
  rows: number;
  x: number;
  y: number;
  endpoint?: string;
  title: string;
  displayType: string;
  groupBy?: string;
  event?: string;
} 