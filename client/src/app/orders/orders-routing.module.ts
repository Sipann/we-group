import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  {
    path: 'new/:groupid',
    component: OrdersPage
  },
  {
    path: 'all/:groupid',
    loadChildren: () => import('./orders-list/orders-list.module').then(m => m.OrdersListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule { }
