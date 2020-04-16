import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersListPage } from './orders-list.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersListPage
  },
  // {
  //   path: 'order-archive',
  //   loadChildren: () => import('./order-archive/order-archive.module').then( m => m.OrderArchivePageModule)
  // },
  {
    path: 'archive',
    loadChildren: () => import('./order-archive/order-archive.module').then(m => m.OrderArchivePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersListPageRoutingModule { }
