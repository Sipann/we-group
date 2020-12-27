import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { GroupOrder } from 'src/app/models/group-order.model';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';


@Component({
  selector: 'app-group-order',
  templateUrl: './group-order.page.html',
  styleUrls: ['./group-order.page.scss'],
})
export class GroupOrderPage implements OnInit, OnDestroy {

  public date: string;
  public display: string = 'items';
  public groupid: string;
  public groupname$: string;
  public order$: GroupOrder;

  private orderSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      if (!paramMap.has('date')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');
      this.date = paramMap.get('date');

      // this.orderSub = this.store.select('groups')
      //   .pipe(map(g => g.groups))
      //   .subscribe(groups => {
      //     const group = groups.find(g => g.id === this.groupid);
      //     if (group && group.orders) {
      //       this.groupname$ = group.name;
      //       this.order$ = group.orders[this.date];
      //     }
      //   })
    });
  }

  markOrderAs(status: string) {
    console.log('TODO: mark order as pending / done');
  }

  summaryDisplayChanged(e: CustomEvent<SegmentChangeEventDetail>) {
    this.display = e.detail.value;
  }

  setDeliveryStatus() {
    const now = new Date();
    if (new Date(this.order$.order_deadline_ts) > now) { return 'planned'; }
    if (new Date(this.order$.order_delivery_ts) > now) { return 'planned'; }
    return this.order$.order_delivery_status;
  }

}
