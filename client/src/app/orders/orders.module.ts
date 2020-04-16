import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { OrderInputComponent } from './order-input/order-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OrdersPage, OrderInputComponent],
  entryComponents: [OrderInputComponent]
})
export class OrdersPageModule { }
