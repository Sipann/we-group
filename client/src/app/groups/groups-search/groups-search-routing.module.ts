import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsSearchPage } from './groups-search.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsSearchPageRoutingModule {}
