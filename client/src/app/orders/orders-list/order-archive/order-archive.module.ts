import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderArchivePageRoutingModule } from './order-archive-routing.module';

import { OrderArchivePage } from './order-archive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderArchivePageRoutingModule
  ],
  declarations: [OrderArchivePage]
})
export class OrderArchivePageModule {}
