import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

// import { ApiClientService } from 'src/app/services/api-client.service';

import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/index';

import { map, reduce } from 'rxjs/operators';
import * as fromOrdersActions from '../../../store/actions/orders.actions';

@Component({
  selector: 'app-order-archive',
  templateUrl: './order-archive.page.html',
  styleUrls: ['./order-archive.page.scss'],
})
export class OrderArchivePage implements OnInit, OnDestroy {

  alertCtrl;
  isEditable = false;
  loadingCtrl;
  order: {
    groupname: string,
    orderid: number,
    deadline: string,
    items: { itemid: number, orderedid: number, name: string, quantity: number }[]
  };
  orderId: number;
  orderid: number;
  ordered: {} = {};
  order$;

  private orderSub: Subscription;

  constructor(
    private alertController: AlertController,
    // private apiClientService: ApiClientService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    // private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('orderid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      // this.orderId = parseInt(paramMap.get('orderid'));
      this.orderid = parseInt(paramMap.get('orderid'));

      await this.presentLoading();

      this.orderSub = this.store.select('orders')
        .pipe(map(o => o.list))
        .subscribe(orders => {
          console.log('ORDER SUB orders:', orders);
          this.order$ = orders.find(o => o.orderid == this.orderid);
          this.isEditable = new Date(this.order$.deadline) > new Date();
          if (this.isEditable) {
            this.order$.items.forEach(item => {
              this.ordered[item.orderedid] = item.quantity;
            });
          }
          if (this.loadingCtrl) this.loadingCtrl.dismiss();
        });

      // if (this.router.getCurrentNavigation().extras.state) {
      //   this.order = this.router.getCurrentNavigation().extras.state.order;
      //   this.isEditable = new Date(this.order.deadline) > new Date();
      //   if (this.isEditable) {
      //     this.order.items.forEach(item => {
      //       this.ordered[item.orderedid] = item.quantity;
      //     });
      //   }
      // }
    })
  }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
  }

  formatDate(deadline) {
    // return moment(new Date(deadline)).format('Do MMM YYYY');
  }

  onRemoveFromBasket(item: { itemid: number, orderedid: number, name: string, quantity: number }) {
    if (this.ordered[item.orderedid] > 0) this.ordered[item.orderedid] -= 1;
  }

  onCancel() {
    // for (let orderedid in this.ordered) {
    //   if (this.ordered.hasOwnProperty(orderedid)) {
    //     const initialData = this.order.items.find(item => +item.orderedid === +orderedid);
    //     this.ordered[orderedid] = initialData.quantity;
    //   }
    // }
  }

  async onSave() {
    const updatedOrder = [];
    console.log('ON SAVE this.ordered', this.ordered);
    for (let orderedid in this.ordered) {
      if (this.ordered.hasOwnProperty(orderedid)) {
        const initialData = this.order$.items.find(item => +item.orderedid === +orderedid);
        updatedOrder.push({
          orderid: this.order$.orderid,
          itemid: initialData.itemid,
          orderedid: orderedid,
          quantityChange: this.ordered[orderedid] - initialData.quantity
        });
      }
    }
    // await this.presentLoading();

    console.log('updatedOrder', updatedOrder);
    this.store.dispatch(new fromOrdersActions.UpdateOrder(updatedOrder));

    // this.orderSub = this.apiClientService.updateOrder(updatedOrder)
    //   .subscribe(data => {
    //     this.loadingCtrl.dismiss();
    //     this.showAlert('Done!', 'Your order has been changed');
    //   });

  }

  async presentLoading() {
    this.loadingCtrl = await this.loadingController.create({
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return this.loadingCtrl.present();
  }


  showAlert(header: string, message: string) {
    this.alertController
      .create({
        header: header,
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }
}
