import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';
import { ApiClientService } from 'src/app/services/api-client.service';

import { OrderSummary } from '../../models/ordersummary.model';
import { OrderOutput } from 'src/app/models/order-output.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {

  private ordersSub: Subscription;

  archiveIsEmpty = true;
  group: Group;
  groupId: number;
  loadingOrders = true;
  orders: {
    groupname: string,
    orderid: number,
    deadline: string,
    items: { id?: number, name: string, quantity: number }[]
    // items: { name: string, quantity: number }[]
  }[];
  reduced;


  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private navCtrl: NavController,
    private router: Router) { }


  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }


  async initialize() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupId = parseInt(paramMap.get('groupid'));

      if (this.router.getCurrentNavigation().extras.state || this.group) {
        const group = this.router.getCurrentNavigation().extras.state;
        this.group = Group.parse(group);

        this.ordersSub = this.apiClientService.getUserOrders()
          .subscribe(data => {
            if (data.length) {
              this.archiveIsEmpty = false;
              this.reduced = this.reduceData(data);
              const all: {
                groupname: string,
                orderid: number,
                deadline: string,
                items: { id?: number, name: string, quantity: number }[]
                // items: { name: string, quantity: number }[]
              }[] = [];
              let key = this.groupId;
              let groupname = this.reduced[key].groupname;
              for (let prop in this.reduced[key]) {
                if (this.reduced[key].hasOwnProperty(prop) && prop !== 'groupname') {
                  all.push({
                    groupname: groupname,
                    orderid: +prop,
                    deadline: this.reduced[key][prop].orderdeadline,
                    items: this.reduced[key][prop].items,
                  });
                }
              }
              this.orders = all;
            }
            this.loadingOrders = false;
          })
      }

      else {
        this.navCtrl.navigateBack(`/groups/detail/${ this.groupId }`);
        return;
      }
    });
  }


  onNavigateToOrderDetails(order: {
    groupname: string,
    orderid: number,
    deadline: string,
    items: { id?: number, name: string, quantity: number }[]
    // items: { name: string, quantity: number }[]
  }) {
    let navigationExtras = {
      state: { order }
    };
    this.router.navigate(['/', 'orders', 'all', this.group.id, 'archive', order.orderid], navigationExtras);
  }


  reduceData(data: OrderOutput[]) {
    return data.reduce((acc: {}, curr: OrderSummary) => {
      const currentGroup = curr.ordergroup;
      if (acc[currentGroup]) {
        if (acc[currentGroup][curr.orderid]) {
          acc[currentGroup][curr.orderid].items = [
            ...acc[currentGroup][curr.orderid].items,
            { itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }
          ]
        }
        else {
          let newOrder = {
            [curr.orderid]: {
              orderdeadline: curr.orderdeadline,
              items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
            }
          };
          acc = {
            ...acc,
            [currentGroup]: {
              ...acc[currentGroup],
              ...newOrder
            }
          }
        }
      }
      else {
        acc = {
          ...acc,
          [currentGroup]: {
            groupname: curr.groupname,
            [curr.orderid]: {
              orderdeadline: curr.orderdeadline,
              items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
            }
          }
        }
      }
      return acc;
    }, {});
  }

}
