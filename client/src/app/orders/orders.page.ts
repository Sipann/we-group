import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Group } from '../models/group.model';
import { Item } from '../models/item.model';

import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { map } from 'rxjs/operators';
import * as fromGroupsActions from '../store/actions/groups.actions';
import * as fromOrdersActions from '../store/actions/orders.actions';

import { OrdersService } from 'src/app/services/orders.service';

import * as moment from 'moment';

import { setUpLoader } from '../groups/groups-utils';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  availableItems: Item[];
  availableOrders$;
  availableOrdersKeys$;
  empty = true;
  group: Group;
  groupId: number;
  loadingCtrl;
  ordered: {} = {};
  show = false;

  groupid: string;
  group$: Group;

  orderPending = true;

  private itemsSub: Subscription;
  private orderSub: Subscription;
  private availableOrdersSub: Subscription;

  groupSub: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
    if (this.itemsSub) this.itemsSub.unsubscribe();
    if (this.groupSub) this.groupSub.unsubscribe();
    if (this.availableOrdersSub) this.availableOrdersSub.unsubscribe();
  }

  ionViewWillLeave() {
    this.store.dispatch(new fromOrdersActions.ResetOrderPending());
  }

  //
  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/group');
        return;
      }



      this.groupid = paramMap.get('groupid');



      this.loadingCtrl = await setUpLoader(this.loadingController);
      // await this.presentLoading();

      // fetch available orders for this group - not stored in state as may change in the meantime

      this.availableOrdersSub = this.ordersService.fetchGroupAvailableOrders(this.groupid)
        .subscribe(data => {
          console.log('ORDERS PAGE DATA => ', data);
          this.availableOrders$ = data;
          console.log('KEYS', Object.keys(this.availableOrders$));
          this.availableOrdersKeys$ = Object.keys(data);
        });


      // this.store.dispatch(new fromGroupsActions.FetchGroupItems({ groupid: this.groupid }));

      // this.groupSub = this.store.select('groups')
      //   .pipe(map(g => g.groups))
      //   .subscribe(groups => {
      //     this.group$ = groups.find(g => g.id == this.groupid);
      //     if (this.group$.items) {
      //       this.empty = !this.group$.items.length;
      //       this.group$.items.forEach(item => {
      //         this.ordered[item.id] = 0;
      //       });
      //     }
      //     this.loadingCtrl.dismiss();
      //   });

      // this.orderSub = this.store.select('orders')
      //   .pipe(map(o => o.orderCreated))
      //   .subscribe(v => {
      //     this.orderPending = !v;
      //   });


    });
  }

  onNavigateToOrder(orderid: string) {
    console.log('onNavigateToOrder', orderid);
    console.log('onNavigateToOrder sending order', this.availableOrders$[orderid]);
    this.router.navigate(['/', 'orders', 'new', this.groupid, 'place-order', orderid], {
      state: { order: this.availableOrders$[orderid] }
    });
  }

  formatDate(deadline) {
    return moment(new Date(deadline)).format('Do MMM YYYY - hh:mm a');
  }

  // TO BE TRANSFERED TO place-order page - START
  onAddToBasket(itemid: number, available: number) {
    if (this.ordered[itemid] < available) this.ordered[itemid] += 1;
  }

  onCancel() { this.navCtrl.navigateBack(`/groups/detail/${ this.groupid }`); }

  onOrder() {
    const orderedItems = [];
    for (let itemid in this.ordered) {
      if (this.ordered.hasOwnProperty(itemid) && this.ordered[itemid] > 0) {
        orderedItems.push({ itemid: +itemid, quantity: +this.ordered[itemid] });
      }
    }
    if (orderedItems.length) {
      // this.store.dispatch(new fromOrdersActions.CreateOrder({ groupid: this.groupid, deadline: this.group$.deadline, orderedItems }));
    }
    else {
      const message = 'You have not selected any item';
      this.alertCtrl.create({
        header: 'Your basket is empty',
        message: message,
        buttons: ['OK']
      }).then(alertEl => alertEl.present());
    }
  }

  onRemoveFromBasket(itemid: number) {
    if (this.ordered[itemid] > 0) this.ordered[itemid] -= 1;
  }
  // TO BE TRANSFERED TO place-order page - END


}
