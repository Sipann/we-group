import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersListPage } from './orders-list.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersListPage
  },
  // {
  //   path: 'archive',
  //   loadChildren: () => import('./order-archive/order-archive.module').then(m => m.OrderArchivePageModule)
  // },
  {
    path: 'group/:groupname',
    loadChildren: () => import('./orders-group/orders-group.module').then(m => m.OrdersGroupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersListPageRoutingModule { }
