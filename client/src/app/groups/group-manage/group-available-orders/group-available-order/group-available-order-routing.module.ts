import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupAvailableOrderPage } from './group-available-order.page';

const routes: Routes = [
  {
    path: '',
    component: GroupAvailableOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupAvailableOrderPageRoutingModule {}
