import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderArchivePage } from './order-archive.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: OrderArchivePage
  // },
  {
    path: ':orderid',
    component: OrderArchivePage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderArchivePageRoutingModule { }
