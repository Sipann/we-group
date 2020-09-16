import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  private loadingCtrl: HTMLIonLoadingElement;
  public availableOrder;
  public availableOrderItems;
  public availableItems;
  private ordered: {} = {};
  private availableOrderid: string;

  constructor(
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  async initialize() {

    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('orderid')) {
        this.navCtrl.navigateBack('/orderid');
        return;
      }

      if (this.router.getCurrentNavigation().extras.state) {
        const { order } = this.router.getCurrentNavigation().extras.state;
        if (!order) {
          this.navCtrl.navigateBack('/group');
          return;
        }

        this.availableOrderid = paramMap.get('orderid');

        this.availableOrder = order;
        console.log('this.availableOrder', this.availableOrder);
        this.availableOrderItems = order.items.reduce((acc, curr) => {
          if (curr.availableitemremainingqty > 0) {
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
          this.ordered[item.availableitemid] = 0;
        })
        console.log('PLACE ORDER PAGE this.ordered', this.ordered);

        console.log('PLACE ORDER PAGE this.availableOrderItems', this.availableOrderItems);
        this.availableItems = order.items.map(item => item.availableitemremainingqty > 0);
        //TODO later? show me sold-out?
      }


    })

  }

  onAddToBasket(availableitemid: string, availableitemremainingqty: number) {
    if (this.ordered[availableitemid] < availableitemremainingqty) this.ordered[availableitemid] += 1;
    // console.log('ADD TO BASKET, this.ordered => ', this.ordered);
  }

  onRemoveFromBasket(availableitemid: string) {
    if (this.ordered[availableitemid] > 0) this.ordered[availableitemid] -= 1;
    // console.log('REMOVE FROM BASKET, this.ordered => ', this.ordered);
  }

  onCancel() { }

  async onOrder() {
    console.log('ORDERING:', this.ordered);
    const orderedItems = [];
    for (let availableitemid in this.ordered) {
      if (this.ordered.hasOwnProperty(availableitemid) && this.ordered[availableitemid] > 0) {
        const item = this.availableOrderItems.available.find(item => item.availableitemid === availableitemid);
        const itemid = item.itemid;
        orderedItems.push({
          availableitemid,
          itemid,
          orderedQty: +this.ordered[availableitemid]
        });
      }
    }
    if (orderedItems.length) {
      console.log('ORDERING => ', {
        availableOrderid: this.availableOrderid,
        items: orderedItems,
      });
      // {
      // availableOrderid: "1"
      // items: Array(2)
      // 0: { availableitemid: "7", itemid: "14", orderedQty: 3 }
      // 1: { availableitemid: "11", itemid: "18", orderedQty: 3 }
      // }

      this.store.dispatch(new fromOrdersActions.PlaceOrder({
        availableOrderid: this.availableOrderid,
        items: orderedItems,
      }))
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

}
