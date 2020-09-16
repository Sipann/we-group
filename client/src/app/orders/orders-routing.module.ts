import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./orders-list/orders-list.module').then(m => m.OrdersListPageModule)
  },
  {
    path: 'new/:groupid',
    component: OrdersPage
  },
  {
    // path: 'place-order',
    path: 'new/:groupid/place-order/:orderid',
    loadChildren: () => import('./place-order/place-order.module').then(m => m.PlaceOrderPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule { }
