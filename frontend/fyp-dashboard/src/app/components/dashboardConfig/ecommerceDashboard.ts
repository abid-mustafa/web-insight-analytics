import { EcommerceGridItem } from '../e-commerce/e-commerce.component';

export const ecommerceDashboard: EcommerceGridItem[] = [
  {
    cols: 2,
    rows: 1,
    x: 0,
    y: 0,
    endpoint: 'ecommerce/sales',
    title: 'Total Sales',
    displayType: 'summary',
  },
  {
    cols: 1,
    rows: 1,
    x: 2,
    y: 0,
    endpoint: 'ecommerce/orders',
    title: 'Orders',
    displayType: 'summary',
  },
  {
    cols: 1,
    rows: 1,
    x: 0,
    y: 1,
    endpoint: 'ecommerce/top-products',
    title: 'Top Products',
    displayType: 'table',
  },
  {
    cols: 1,
    rows: 1,
    x: 1,
    y: 1,
    endpoint: 'ecommerce/returns',
    title: 'Returns',
    displayType: 'table',
  },
  {
    cols: 1,
    rows: 1,
    x: 2,
    y: 1,
    endpoint: 'ecommerce/inventory',
    title: 'Inventory',
    displayType: 'table',
  },
];
