import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersGroupPageRoutingModule } from './orders-group-routing.module';

import { OrdersGroupPage } from './orders-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersGroupPageRoutingModule
  ],
  declarations: [OrdersGroupPage]
})
export class OrdersGroupPageModule {}
