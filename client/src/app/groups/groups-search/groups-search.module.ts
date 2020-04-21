import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsSearchPageRoutingModule } from './groups-search-routing.module';

import { GroupsSearchPage } from './groups-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsSearchPageRoutingModule
  ],
  declarations: [GroupsSearchPage]
})
export class GroupsSearchPageModule {}
