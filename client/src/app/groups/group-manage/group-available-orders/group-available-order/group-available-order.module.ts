import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupAvailableOrderPageRoutingModule } from './group-available-order-routing.module';

import { GroupAvailableOrderPage } from './group-available-order.page';

import { NewAvailableItemComponent } from './new-available-item/new-available-item.component';
import { AddAvailableItemComponent } from './add-available-item/add-available-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupAvailableOrderPageRoutingModule
  ],
  declarations: [GroupAvailableOrderPage, NewAvailableItemComponent, AddAvailableItemComponent],
  entryComponents: [NewAvailableItemComponent, AddAvailableItemComponent]
})
export class GroupAvailableOrderPageModule { }
