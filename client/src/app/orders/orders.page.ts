import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ApiClientService } from '../services/api-client.service';
import { Group } from '../models/group.model';
import { Item } from '../models/item.model';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  availableItems: Item[];
  empty = true;
  group: Group;
  groupId: number;
  ordered: {} = {};
  show = false;

  private itemsSub: Subscription;
  private orderSub: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private apiClientService: ApiClientService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.presentLoading();
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        this.loadingCtrl.dismiss();
        return;
      }
      this.groupId = parseInt(paramMap.get('groupid'));

      if (this.router.getCurrentNavigation().extras.state) {
        const group = this.router.getCurrentNavigation().extras.state;
        this.group = Group.parse(group);

        this.itemsSub = this.apiClientService.getGroupItems(this.groupId)
          .subscribe(data => {
            if (data.length) {
              this.availableItems = data;
              this.availableItems.forEach(item => {
                this.ordered[item.id] = 0;
              });
              this.empty = false;
            }
            this.show = true;
            this.loadingCtrl.dismiss();
          });
      }
      else {
        this.router.navigate(['/', 'groups', 'detail', this.groupId]);
        return;
      }
    });
  }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
    if (this.itemsSub) this.itemsSub.unsubscribe();
  }

  onAddToBasket(itemid: number, available: number) {
    if (this.ordered[itemid] < available) this.ordered[itemid] += 1;
  }

  onCancel() { this.navCtrl.navigateBack(`/groups/detail/${ this.group.id }`); }

  onOrder() {
    const orderedItems = [];
    for (let itemid in this.ordered) {
      if (this.ordered.hasOwnProperty(itemid) && this.ordered[itemid] > 0) {
        orderedItems.push({ itemid: +itemid, quantity: +this.ordered[itemid] });
      }
    }
    if (orderedItems.length) {
      this.orderSub = this.apiClientService.createOrder(this.group.id, this.group.deadline, orderedItems)
        .subscribe(data => {
          this.navCtrl.navigateBack(`/groups/detail/${ this.groupId }`);
        });
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

  onRemoveFromBasket(itemid: number) {
    if (this.ordered[itemid] > 0) this.ordered[itemid] -= 1;
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return loading.present();
  }

}
