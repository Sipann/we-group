import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupManagePage } from './group-manage.page';

const routes: Routes = [
  {
    path: '',
    component: GroupManagePage,
  },
  {
    path: 'available-orders',
    loadChildren: () => import('./group-available-orders/group-available-orders.module').then(m => m.GroupAvailableOrdersPageModule)
  },
  {
    path: ':date',
    loadChildren: () => import('./group-order/group-order.module').then(m => m.GroupOrderPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupManagePageRoutingModule { }
