import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPageRoutingModule } from './groups-routing.module';

import { GroupsPage } from './groups.page';
import { NewProductModalComponent } from './group-manage/group-products/new-product-modal/new-product-modal.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsPageRoutingModule
  ],
  declarations: [GroupsPage, NewProductModalComponent, NewGroupModalComponent],
  entryComponents: [NewProductModalComponent, NewGroupModalComponent]
})
export class GroupsPageModule { }
