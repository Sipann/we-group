import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState, selectPlacedOrdersForCurrentGroup } from 'src/app/store/reducers'; import { map } from 'rxjs/operators';

import { setUpLoader } from 'src/app/groups/groups-utils';


@Component({
  selector: 'app-orders-group',
  templateUrl: './orders-group.page.html',
  styleUrls: ['./orders-group.page.scss'],
})
export class OrdersGroupPage implements OnInit, OnDestroy {

  private loadingCtrl: HTMLIonLoadingElement;
  private ordersSub: Subscription;
  public placedOrders$;
  public displayedOrder = null;

  public groupid: string;

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }

  async initialize() {
    console.log('orders-group page');
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/group');
        return;
      }

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.groupid = paramMap.get('groupid');

      this.ordersSub = this.store.select(selectPlacedOrdersForCurrentGroup, { groupid: paramMap.get('groupid') }).subscribe((v) => {
        console.log('Orders Sub v =>', v);
        this.placedOrders$ = v;

        if (this.loadingCtrl) this.loadingCtrl.dismiss();
      })
    })
  }

  checkOrderDetails(deadline: string) {
    this.displayedOrder = this.placedOrders$[deadline];
  }

  getOrderTotal(items) {
    const itemsKeys = Object.keys(items);
    let total = 0;
    itemsKeys.forEach(itemkey => {
      const int = items[itemkey].itemprice * items[itemkey].itemQty;
      total += int;
    });
    return total;
  }

}
