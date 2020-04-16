import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {

  private ordersSub: Subscription;
  private groupSub: Subscription;

  group: Group;
  orders: {
    id: string,
    items: { name: string, quantity: number, 'price/u': number }[],
    date: string
  }[] = [
      {
        id: '1',
        items: [
          { name: 'baguette', quantity: 2, 'price/u': 400 },
          { name: 'pain au chocolat', quantity: 4, 'price/u': 500 }
        ],
        date: '2020-1-20',
      },
      {
        id: '2',
        items: [{ name: 'baguette', quantity: 3, 'price/u': 400 },],
        date: '2020-1-22',
      },
    ];

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private groupsService: GroupsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        // show all orders for this user
        // this.orders ...
        return;
      }
      // else, filter order for this user for this group
      // this.orders ...
      // this.ordersSub = this.ordersService.groups.subscribe(orders => {
      //   this.orders = orders;
      // });

      // and get group
      this.groupSub = this.groupsService.getGroup(parseInt(paramMap.get('groupid'))).subscribe(group => {
        this.group = group;
      });

    });
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
    if (this.groupSub) this.groupSub.unsubscribe();
  }

}
