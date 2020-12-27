import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState, selectManageAvailableOrderWithId } from 'src/app/store/reducers';

import { NewAvailableItemComponent } from './new-available-item/new-available-item.component';
import { AddAvailableItemComponent } from './add-available-item/add-available-item.component';

import { getArraysDifference, setUpLoader } from '../../../groups-utils';


@Component({
  selector: 'app-group-available-order',
  templateUrl: './group-available-order.page.html',
  styleUrls: ['./group-available-order.page.scss'],
})
export class GroupAvailableOrderPage implements OnInit, OnDestroy {

  public availableOrder$;
  public availableItems$;
  public groupItems$;
  private loadingCtrl: HTMLIonLoadingElement;
  private groupid: string;
  private orderid: string;

  private availableOrderSub: Subscription;
  private groupItemsSub: Subscription;
  private groupAvailableOrdersSub: Subscription;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.availableOrderSub) this.availableOrderSub.unsubscribe();
    if (this.groupItemsSub) this.groupItemsSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid') || (!paramMap.has('orderid'))) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');
      this.orderid = paramMap.get('orderid');

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.groupAvailableOrdersSub = this.store.select(selectManageAvailableOrderWithId, { groupid: paramMap.get('groupid'), orderid: paramMap.get('orderid') })
        .subscribe((v) => {
          console.log('GROUP AVAILABLE ORDER =>', v);
          this.availableItems$ = v.items;
        });

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    });

  }

  onAddItemToOrder(itemid: string) {
    console.log('onAddItemToOrder itemid', itemid);
    this.modalCtrl
      .create({
        component: AddAvailableItemComponent,
        componentProps: { itemid, groupid: this.groupid, orderid: this.orderid },
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        // reset
      });
  }

  async onDeleteItemFromGroup(itemid: string) {
    //TODO
    console.log('onDeleteItemFromGroup itemid', itemid);
  }

  onCreateNewItem() {
    console.log('create new item');
    this.modalCtrl
      .create({
        component: NewAvailableItemComponent,
        componentProps: { groupid: this.groupid, orderid: this.orderid },
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        // this.store.dispatch(new fromGroupsActions.ResetCreateGroup());
      });
  }



}