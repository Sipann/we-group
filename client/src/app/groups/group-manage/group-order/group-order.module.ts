import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupOrderPageRoutingModule } from './group-order-routing.module';

import { GroupOrderPage } from './group-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupOrderPageRoutingModule
  ],
  declarations: [GroupOrderPage]
})
export class GroupOrderPageModule {}
