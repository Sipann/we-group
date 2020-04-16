import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: OrdersPage
  // },
  {
    path: 'new/:groupid',
    component: OrdersPage
  },
  // {
  //   path: 'orders-list',
  //   loadChildren: () => import('./orders-list/orders-list.module').then( m => m.OrdersListPageModule)
  // },
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
