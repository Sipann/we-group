import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoadingController, ModalController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../../../groups-utils';



@Component({
  selector: 'app-new-available-item',
  templateUrl: './new-available-item.component.html',
  styleUrls: ['./new-available-item.component.scss'],
})
export class NewAvailableItemComponent implements OnInit {

  @Input() groupid: string;
  @Input() orderid: string;
  @ViewChild('f', { static: true }) form: NgForm;

  public itemName: string;
  public itemDescription: string;
  public itemPrice: number;
  public itemInitialQty: number;
  private loadingCtrl: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) { }

  ngOnInit() { }

  async onAddNewItem() {
    const newItem = {
      itemName: this.form.value['item-name'],
      itemDescription: this.form.value['item-description'],
      itemPrice: this.form.value['item-price'],
      itemInitialQty: this.form.value['item-initial-qty']
    };

    this.loadingCtrl = await setUpLoader(this.loadingController);
    this.loadingCtrl.present();

    // console.log('NEW ITEM', { orderid: this.orderid, item: newItem });
    // this.store.dispatch(new fromGroupsActions.AddNewItem({
    //   groupid: this.groupid,
    //   orderid: this.orderid,
    //   item: newItem
    // }));

    this.loadingCtrl.dismiss(); //!

  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
