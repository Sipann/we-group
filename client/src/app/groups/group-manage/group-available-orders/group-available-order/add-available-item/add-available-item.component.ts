import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../../../groups-utils';


@Component({
  selector: 'app-add-available-item',
  templateUrl: './add-available-item.component.html',
  styleUrls: ['./add-available-item.component.scss'],
})
export class AddAvailableItemComponent implements OnInit {

  @Input() itemid: string;
  @Input() groupid: string;
  @Input() orderid: string;

  @ViewChild('f', { static: true }) form: NgForm;

  public itemInitialQty: number;
  private loadingCtrl: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { }

  async onAddItemToOrder() {
    this.loadingCtrl = await setUpLoader(this.loadingController);
    this.loadingCtrl.present();

    console.log('SENDING', {
      groupid: this.groupid,
      orderid: this.orderid,
      itemData: {
        itemid: this.itemid,
        initialQty: this.form.value['item-initial-qty'],
      }
    })

    this.store.dispatch(new fromGroupsActions.AddItemToOrder({
      groupid: this.groupid,
      orderid: this.orderid,
      itemData: {
        itemid: this.itemid,
        initialQty: this.form.value['item-initial-qty'],
      }
    }));

    this.loadingCtrl.dismiss();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
