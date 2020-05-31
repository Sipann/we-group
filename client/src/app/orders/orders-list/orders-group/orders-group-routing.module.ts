import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersGroupPage } from './orders-group.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersGroupPageRoutingModule {}
