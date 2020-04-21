import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsPage } from './groups.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsPage
  },
  {
    path: 'detail/:groupid',
    loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailPageModule)
  },
  {
    path: 'manage/:groupid',
    loadChildren: () => import('./group-manage/group-manage.module').then(m => m.GroupManagePageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./groups-search/groups-search.module').then(m => m.GroupsSearchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsPageRoutingModule { }
