import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromOrdersActions from 'src/app/store/actions/orders.actions';

import * as moment from 'moment';
import { setUpLoader } from 'src/app/groups/groups-utils';


@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {

  public archiveIsEmpty = true;
  public groupid: string;
  private loadingCtrl: HTMLIonLoadingElement;
  public orders$;

  private ordersSub: Subscription;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private store: Store<AppState>,
  ) { }


  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }

  async initialize() {

    this.store.dispatch(new fromOrdersActions.FetchUserOrders());

    this.loadingCtrl = await setUpLoader(this.loadingController);
    this.loadingCtrl.present();

    this.ordersSub = this.store.select('orders')
      .pipe(map(o => o.list))
      .subscribe(orders => {
        console.log('FROM COMPONENT: orders', orders);
        if (this.loadingCtrl) this.loadingCtrl.dismiss();
        this.orders$ = orders;
      });
  }

  formatDate(deadline) {
    return moment(new Date(deadline)).format('Do MMM YYYY');
  }

  onNavigateToGroupOrders(groupname: string) {
    console.log('onNavigateToOrder', groupname);
    this.router.navigate(['/', 'orders', 'group', groupname]);
  }


  // onNavigateToOrderDetails(orderid: number) {
  //   this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive', orderid]);
  // }

  // onNavigateToOrderDetails0(order: {
  //   groupname: string,
  //   orderid: number,
  //   deadline: string,
  //   items: { id?: number, name: string, quantity: number }[]
  // }) {
  //   console.log('navigateToOrderDetails with order:', order);
  //   let navigationExtras = {
  //     state: { order }
  //   };
  //   this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive', order.orderid], navigationExtras);
  //   // this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive'], navigationExtras);
  // }


}
