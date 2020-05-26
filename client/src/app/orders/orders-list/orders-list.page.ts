import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';
import { ApiClientService } from 'src/app/services/api-client.service';

import { OrderSummary } from '../../models/ordersummary.model';
import { OrderOutput } from 'src/app/models/order-output.model';
import { Order } from 'src/app/models/order.model';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { map, reduce } from 'rxjs/operators';
import * as fromOrdersActions from '../../store/actions/orders.actions';

import * as moment from 'moment';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {

  private ordersSub: Subscription;

  archiveIsEmpty = true;
  group: Group;
  group$: Group;
  groupId: number;
  groupid: number;
  loadingOrders = true;
  orders$: Order[] = [];
  // orders: {
  //   groupid,
  //   groupname: string,
  //   orderid: number,
  //   deadline: string,
  //   items: { id?: number, name: string, quantity: number }[]
  //   // items: { name: string, quantity: number }[]
  // }[];
  orders = [];
  reduced;

  private loadingCtrl: HTMLIonLoadingElement;

  groupSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private store: Store<AppState>,
  ) { }


  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = parseInt(paramMap.get('groupid'));

      await this.presentLoading();

      this.store.dispatch(new fromOrdersActions.FetchOrders({ groupid: this.groupid }));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          this.loadingCtrl.dismiss();
        });

      this.ordersSub = this.store.select('orders')
        .pipe(map(o => o.list))
        .subscribe(orders => {
          if (orders.length) {
            console.log('ORDER SUB orders', orders);
            this.archiveIsEmpty = false;
            this.orders = orders.filter(o => o.groupid == this.groupid);
          }
        });
    });
  }


  // async initialize0() {
  //   this.route.paramMap.subscribe(paramMap => {
  //     if (!paramMap.has('groupid')) {
  //       this.navCtrl.navigateBack('/groups');
  //       return;
  //     }
  //     this.groupId = parseInt(paramMap.get('groupid'));
  //     console.log('this.groupId', this.groupId);

  //     if (this.router.getCurrentNavigation().extras.state || this.group) {
  //       const group = this.router.getCurrentNavigation().extras.state;
  //       this.group = Group.parse(group);

  //       this.ordersSub = this.apiClientService.getUserOrders()
  //         .subscribe(data => {
  //           console.log('orders-list data', data);
  //           if (data.length) {
  //             // this.archiveIsEmpty = false;
  //             this.reduced = this.reduceData(data);
  //             const all: {
  //               groupname: string,
  //               orderid: number,
  //               deadline: string,
  //               items: { id?: number, name: string, quantity: number }[]
  //               // items: { name: string, quantity: number }[]
  //             }[] = [];
  //             let key = this.groupId;

  //             if (this.reduced[key]) {
  //               let groupname = this.reduced[key].groupname;
  //               for (let prop in this.reduced[key]) {
  //                 if (this.reduced[key].hasOwnProperty(prop) && prop !== 'groupname') {
  //                   all.push({
  //                     groupname: groupname,
  //                     orderid: +prop,
  //                     deadline: this.reduced[key][prop].orderdeadline,
  //                     items: this.reduced[key][prop].items,
  //                   });
  //                 }
  //               }
  //               this.orders = all;
  //               this.archiveIsEmpty = false;
  //             }
  //           }
  //           this.loadingOrders = false;
  //         })
  //     }

  //     else {
  //       this.navCtrl.navigateBack(`/groups/detail/${ this.groupId }`);
  //       return;
  //     }
  //   });
  // }

  formatDate(deadline) {
    return moment(new Date(deadline)).format('Do MMM YYYY');
  }

  onNavigateToOrderDetails(orderid: number) {
    this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive', orderid]);
  }

  onNavigateToOrderDetails0(order: {
    groupname: string,
    orderid: number,
    deadline: string,
    items: { id?: number, name: string, quantity: number }[]
  }) {
    console.log('navigateToOrderDetails with order:', order);
    let navigationExtras = {
      state: { order }
    };
    this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive', order.orderid], navigationExtras);
    // this.router.navigate(['/', 'orders', 'all', this.groupid, 'archive'], navigationExtras);
  }


  // reduceOrders(orders: OrderOutput[]) {
  //   console.log('reduceOrders orders - INPUT', orders);
  //   const reduced = this.reduceData(orders[0]);
  //   console.log('reduced', reduced);
  //   const all: {
  //     groupname: string,
  //     orderid: number,
  //     deadline: string,
  //     items: { id?: number, name: string, quantity: number }[]
  //   }[] = [];
  //   let key = this.groupid;

  //   if (reduced[key]) {
  //     let groupname = reduced[key].groupname;
  //     for (let prop in reduced[key]) {
  //       if (reduced[key].hasOwnProperty(prop) && prop !== 'groupname') {
  //         all.push({
  //           groupname: groupname,
  //           orderid: +prop,
  //           deadline: reduced[key][prop].orderdeadline,
  //           items: reduced[key][prop].items,
  //         });
  //       }
  //     }
  //     this.orders = all;
  //     this.archiveIsEmpty = false;
  //   }
  //   console.log('ALL', all);
  // }

  // reduceData(data: OrderOutput[]) {
  //   console.log('reduceData INPUT data', data);
  //   const dataTest = [
  //     { groupid: "14", groupname: "Beachy New", itemid: "33", itemname: "item1", itemprice: "52.00", orderdeadline: "2020-10-10T22:00:00.000Z", orderedid: "42", orderedqty: 5, ordergroup: "14", orderid: "25" },
  //     { groupid: "14", groupname: "Beachy New", itemid: "34", itemname: "item2", itemprice: "32.00", orderdeadline: "2020-10-10T22:00:00.000Z", orderedid: "43", orderedqty: 2, ordergroup: "14", orderid: "25" },
  //     { groupid: "14", groupname: "Beachy New", itemid: "47", itemname: "item15", itemprice: "32.00", orderdeadline: "2020-10-10T22:00:00.000Z", orderedid: "44", orderedqty: 2, ordergroup: "14", orderid: "26" },
  //     { groupid: "14", groupname: "Beachy New", itemid: "35", itemname: "item3", itemprice: "10.00", orderdeadline: "2020-10-10T22:00:00.000Z", orderedid: "45", orderedqty: 3, ordergroup: "14", orderid: "27" }
  //   ]
  //   // return data.reduce((acc: {}, curr: OrderSummary) => {
  //   return dataTest.reduce((acc: {}, curr: OrderSummary) => {
  //     const currentGroup = curr.ordergroup;
  //     if (acc[currentGroup]) {
  //       if (acc[currentGroup][curr.orderid]) {
  //         acc[currentGroup][curr.orderid].items = [
  //           ...acc[currentGroup][curr.orderid].items,
  //           { itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }
  //         ]
  //       }
  //       else {
  //         let newOrder = {
  //           [curr.orderid]: {
  //             orderdeadline: curr.orderdeadline,
  //             items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
  //           }
  //         };
  //         acc = {
  //           ...acc,
  //           [currentGroup]: {
  //             ...acc[currentGroup],
  //             ...newOrder
  //           }
  //         }
  //       }
  //     }
  //     else {
  //       acc = {
  //         ...acc,
  //         [currentGroup]: {
  //           groupname: curr.groupname,
  //           [curr.orderid]: {
  //             orderdeadline: curr.orderdeadline,
  //             items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
  //           }
  //         }
  //       }
  //     }
  //     return acc;
  //   }, {});
  // }


  async presentLoading() {
    this.loadingCtrl = await this.loadingController.create({
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return this.loadingCtrl.present();
  }

}
