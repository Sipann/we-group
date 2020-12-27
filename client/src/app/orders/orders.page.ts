import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Group } from '../models/group.model';
import { Item } from '../models/item.model';

import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromOrdersActions from '../store/actions/orders.actions';

import { OrdersService } from 'src/app/services/orders.service';
import { GroupService } from 'src/app/services/group.service';

import { setUpLoader } from '../groups/groups-utils';
import { formatAvailableOrders } from 'src/app/services/utils';


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
    private groupsService: GroupService,
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
    // this.store.dispatch(new fromOrdersActions.ResetOrderPending());
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
      this.availableOrdersSub = this.groupsService.fetchAvailableOrders({ groupid: this.groupid })
        .subscribe(data => {
          this.availableOrders$ = formatAvailableOrders(data.payload);
        });
      // this.loadingCtrl.dismiss();
    });
  }

  onNavigateToAvailableOrder(availableOrderid: string) {
    this.router.navigate(['/', 'orders', 'new', this.groupid, 'place-order', availableOrderid], {
      state: { order: this.availableOrders$[availableOrderid] }
    });
  }

}
