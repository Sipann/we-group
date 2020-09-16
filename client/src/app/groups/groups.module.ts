import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPageRoutingModule } from './groups-routing.module';

import { StoreModule } from '@ngrx/store';
import * as fromGroup from '../store/reducers/groups.reducers';
import { GroupsEffects } from '../store/effects/groups.effects';

import { EffectsModule } from '@ngrx/effects';

import { GroupsPage } from './groups.page';
// import { NewProductModalComponent } from './group-manage/group-products/new-product-modal/new-product-modal.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsPageRoutingModule,
  ],
  declarations: [
    GroupsPage,
    NewGroupModalComponent
  ], //NewProductModalComponent,
  entryComponents: [
    NewGroupModalComponent
  ] //NewProductModalComponent,
})
export class GroupsPageModule { }
