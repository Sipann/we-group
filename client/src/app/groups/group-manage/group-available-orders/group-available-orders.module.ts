import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupAvailableOrdersPageRoutingModule } from './group-available-orders-routing.module';

import { GroupAvailableOrdersPage } from './group-available-orders.page';

import { NewOrderModalComponent } from './new-order-modal/new-order-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupAvailableOrdersPageRoutingModule
  ],
  declarations: [GroupAvailableOrdersPage, NewOrderModalComponent],
  entryComponents: [NewOrderModalComponent]
})
export class GroupAvailableOrdersPageModule { }
