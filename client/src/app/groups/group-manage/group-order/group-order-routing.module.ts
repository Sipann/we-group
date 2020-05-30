import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupOrderPage } from './group-order.page';

const routes: Routes = [
  {
    path: '',
    component: GroupOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupOrderPageRoutingModule {}
