import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupManagePageRoutingModule } from './group-manage-routing.module';

import { GroupManagePage } from './group-manage.page';
import { GroupInfosComponent } from './group-infos/group-infos.component';
// import { GroupProductsComponent } from './group-products/group-products.component';
import { GroupUsersComponent } from './group-users/group-users.component';
import { GroupSummaryComponent } from './group-summary/group-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupManagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    GroupManagePage,
    GroupInfosComponent,
    GroupUsersComponent,
    GroupSummaryComponent
  ],  // GroupProductsComponent,

  entryComponents: [
    GroupInfosComponent,
    GroupUsersComponent,
    GroupSummaryComponent
  ]  // GroupProductsComponent,
})
export class GroupManagePageModule { }
