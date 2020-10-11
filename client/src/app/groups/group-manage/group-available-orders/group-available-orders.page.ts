import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { formatAvailableOrders } from 'src/app/services/utils';

import { NewOrderModalComponent } from './new-order-modal/new-order-modal.component';
import { GroupAvailableOrders } from 'src/app/models/group-order-available.model';

import { setUpLoader } from '../../groups-utils';

@Component({
  selector: 'app-group-available-orders',
  templateUrl: './group-available-orders.page.html',
  styleUrls: ['./group-available-orders.page.scss'],
})
export class GroupAvailableOrdersPage implements OnInit, OnDestroy {

  public availableOrders$;
  private loadingCtrl: HTMLIonLoadingElement;
  private groupid: string;

  private availableOrdersSub: Subscription;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.availableOrdersSub) this.availableOrdersSub.unsubscribe();
  }

  // formatAvailableOrders(availableOrders: GroupAvailableOrders) {
  //   const formatted = { ...availableOrders };
  //   for (let orderId in availableOrders) {
  //     formatted[orderId] = {
  //       ...availableOrders[orderId],
  //       deliveryTs: format(new Date(availableOrders[orderId].deliveryTs), 'MM/dd/yyyy'),
  //       deadlineTs: format(new Date(availableOrders[orderId].deadlineTs), 'MM/dd/yyyy'),
  //     }
  //   }
  //   return formatted;
  // }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');
      this.store.dispatch(new fromGroupsActions.FetchGroupAvailableOrders({ groupid: this.groupid }));

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.availableOrdersSub = this.store.select('groups')
        .pipe(map(g => g.availableOrders))
        .subscribe(availableOrders => {
          this.availableOrders$ = formatAvailableOrders(availableOrders[this.groupid]);
        });

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    });
  }

  onCreateNewOrder() {
    this.modalCtrl
      .create({
        component: NewOrderModalComponent,
        componentProps: { groupid: this.groupid },
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        // this.store.dispatch(new fromGroupsActions.ResetCreateGroup());
      });
  }


  onNavigateToAvailableOrder(orderid: string) {
    this.router.navigate(['/', 'groups', 'manage', this.groupid, 'available-orders', orderid]);
  }

}
