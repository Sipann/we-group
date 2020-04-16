import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonItemSliding, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Group } from '../models/group.model';
import { OrderInputComponent } from './order-input/order-input.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  orderForm: FormGroup;
  private orderSub: Subscription;
  group: Group;

  products: { name: string, description: string, price: number, currency: string, initial_qty: number }[] = [
    { name: 'baguette', description: 'baguette traditionnelle', price: 450, currency: 'rup', initial_qty: 50 },
    { name: 'banette', description: 'banette 250g', price: 500, currency: 'rup', initial_qty: 50 },
    { name: 'pain au chocolat', description: 'ou chocolatine', price: 700, currency: 'rup', initial_qty: 40 },

  ];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      // this.orderSub = ...
      // assign value to this.group

    });

    // plug products / observables
    const itemsGroup = {};
    this.products.forEach(product => {
      const groupName = product.name;
      itemsGroup[groupName] = this.fb.group({
        'selected': [false],
        'amount': [0]
      });
      this.orderForm = new FormGroup(itemsGroup);
      console.log('this.orderForm', this.orderForm);
    });
  }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
  }

  onCancel() {
    this.orderForm.reset();
    // this.navCtrl.navigateBack(`/groups/detail/${this.group.id}`);
    this.navCtrl.navigateBack(`/groups/detail/1`);
  }

  onOrder() {

  }

  onAddItem(productName, slidingEl: IonItemSliding) {
    console.log('add product', productName);
    this.modalCtrl
      .create({
        component: OrderInputComponent,
        componentProps: {},
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(result => {
        console.log('result', result);
        slidingEl.close();
      });
  }

  onDeleteItem(productName, slidingEl: IonItemSliding) {
    console.log('delete product', productName);
    slidingEl.close();
  }

}
