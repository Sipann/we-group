import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

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



      this.availableOrderSub = this.store.select('groups')
        .pipe(map(g => g.availableOrders))
        .subscribe(availableOrders => {
          this.availableOrder$ = availableOrders[this.groupid][this.orderid];
          this.availableItems$ = availableOrders[this.groupid][this.orderid].items;
        });

      this.groupItemsSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          const group = groups.find(g => g.id === this.groupid);
          console.log('GROUP AVAILABLE ORDER group', group);
          const map = {};
          const result = [];
          if (this.availableItems$) {
            for (let item of this.availableItems$) { map[item.itemid] = true; }
            for (let item of group.items) {
              if (!map[item.id]) result.push(item);
            }
          }
          this.groupItems$ = result;
          console.log('this.groupItems$', this.groupItems$);
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