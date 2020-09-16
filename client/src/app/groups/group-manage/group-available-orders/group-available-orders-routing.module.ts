import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupAvailableOrdersPage } from './group-available-orders.page';

const routes: Routes = [
  {
    path: '',
    component: GroupAvailableOrdersPage
  },
  {
    // path: 'group-available-order',
    path: ':orderid',
    loadChildren: () => import('./group-available-order/group-available-order.module').then(m => m.GroupAvailableOrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupAvailableOrdersPageRoutingModule { }
