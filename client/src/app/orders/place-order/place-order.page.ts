import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';

import { AlertController, NavController, LoadingController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromOrdersActions from 'src/app/store/actions/orders.actions';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.page.html',
  styleUrls: ['./place-order.page.scss'],
})
export class PlaceOrderPage implements OnInit {

  public availableOrder;
  public availableOrderItems;
  public availableItems;
  private ordered: {} = {};
  private availableOrderid: string;
  private groupid: string;
  private availableOrderItemsState: { [key: string]: { available: number } } = {};

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('orderid') || !paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      if (this.router.getCurrentNavigation().extras.state) {
        const { order } = this.router.getCurrentNavigation().extras.state;
        if (!order) {
          this.navCtrl.navigateBack('/groups');
          return;
        }

        this.availableOrderid = paramMap.get('orderid');
        this.groupid = paramMap.get('groupid');

        this.availableOrder = cloneDeep(order);

        const summary = {};
        this.availableOrder.items.forEach(item => {
          if (item.available_item_remaining_qty > 0) {
            summary[item.available_item_id] = { available: item.available_item_remaining_qty }
          }
        });
        this.availableOrderItemsState = { ...summary };

        this.availableOrderItems = order.items.reduce((acc, curr) => {
          if (curr.available_item_remaining_qty > 0) {
            return {
              available: [...acc.available, curr],
              soldout: [...acc.soldout],
            };
          }
          else {
            return {
              available: [...acc.available],
              soldout: [...acc.soldout, curr],
            }
          }
        }, { available: [], soldout: [] });

        this.availableOrderItems.available.forEach(item => {
          this.ordered[item.available_item_id] = 0;
        })

        this.availableItems = order.items.map(item => item.availableitemremainingqty > 0);
      }
    })
  }

  onAddToBasket(availableItemid: string, availableItemRemainingQty: number) {
    if (availableItemRemainingQty > 0) {
      this.ordered[availableItemid] += 1;
      this.availableOrderItemsState[availableItemid].available -= 1;
    }
  }

  onRemoveFromBasket(availableItemid: string) {
    if (this.ordered[availableItemid] > 0) {
      this.ordered[availableItemid] -= 1;
      this.availableOrderItemsState[availableItemid].available += 1;
    }
  }

  onCancel() { this.navCtrl.navigateBack(`/groups/detail/${ this.groupid }`); } //? url

  async onOrder() {
    const orderedItems = [];
    for (let availableItemId in this.ordered) {
      if (this.ordered.hasOwnProperty(availableItemId) && this.ordered[availableItemId] > 0) {
        const item = this.availableOrder.items.find(item => item.available_item_id === availableItemId);
        const itemid = item.available_item_id;
        orderedItems.push({
          availableItemId,
          itemid,
          orderedQty: +this.ordered[availableItemId]
        });
      }
    }
    if (orderedItems.length) {
      this.store.dispatch(new fromOrdersActions.PlaceOrder({
        availableOrderid: this.availableOrderid,
        items: orderedItems,
      }))
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
}
