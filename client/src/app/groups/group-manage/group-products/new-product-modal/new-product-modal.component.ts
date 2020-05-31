import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalController, LoadingController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../../groups-utils';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-new-product-modal',
  templateUrl: './new-product-modal.component.html',
  styleUrls: ['./new-product-modal.component.scss'],
})
export class NewProductModalComponent implements OnInit, OnDestroy {

  @Input() group: Group;
  @ViewChild('f', { static: true }) form: NgForm;

  private loadingCtrl: HTMLIonLoadingElement;

  productAmount: number;
  productCurrency: string;
  productDescription: string;
  productName: string;
  productPrice: number;

  private addItemSub: Subscription;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private store: Store<AppState>,
  ) {
    this.addItemSub = this.store.select('groups')
      .pipe(map(s => s.itemAdded))
      .subscribe(v => {
        if (v) {
          if (this.loadingCtrl) this.loadingCtrl.dismiss();
          this.form.reset();
          this.modalCtrl.dismiss();
        }
      });
  }

  ngOnInit() {
    this.productCurrency = this.group.currency;
  }

  ngOnDestroy() {
    if (this.addItemSub) this.addItemSub.unsubscribe();
  }

  async onAddProduct() {
    await setUpLoader(this.loadingController);

    const item = {
      name: this.form.value['product-name'],
      description: this.form.value['product-description'],
      price: this.form.value['product-price'],
      currency: this.form.value['product-currency'],
      initial_qty: this.form.value['product-amount']
    };

    this.store.dispatch(new fromGroupsActions.AddItem({ item, groupid: this.group.id }))
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onResetNewProductForm() {
    this.form.reset();
  }
}
