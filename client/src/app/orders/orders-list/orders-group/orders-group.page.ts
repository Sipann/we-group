import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers'; import { map } from 'rxjs/operators';

import { setUpLoader } from 'src/app/groups/groups-utils';


@Component({
  selector: 'app-orders-group',
  templateUrl: './orders-group.page.html',
  styleUrls: ['./orders-group.page.scss'],
})
export class OrdersGroupPage implements OnInit, OnDestroy {

  private loadingCtrl: HTMLIonLoadingElement;
  private ordersSub: Subscription;
  public orders$;
  public displayedOrder = null;

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

    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupname')) {
        this.navCtrl.navigateBack('/group');
        return;
      }

      this.loadingCtrl = await setUpLoader(this.loadingController);
      const groupname = paramMap.get('groupname');


      this.ordersSub = this.store.select('orders')
        .pipe(map(o => o.list))
        .subscribe(orders => {
          this.orders$ = orders[groupname];

          if (this.loadingCtrl) this.loadingCtrl.dismiss();
        });

    })
  }

  checkOrderDetails(deadline: string) {
    this.displayedOrder = this.orders$[deadline];
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
