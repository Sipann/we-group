import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { NewOrderModalComponent } from './new-order-modal/new-order-modal.component';

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

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');
      // console.log('PARAM MAP groupid', paramMap.get('groupid'));
      this.store.dispatch(new fromGroupsActions.FetchGroupAvailableOrders({ groupid: this.groupid }));



      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.availableOrdersSub = this.store.select('groups')
        .pipe(map(g => g.availableOrders))
        .subscribe(availableOrders => {
          // console.log('available orders', availableOrders);
          this.availableOrders$ = availableOrders[this.groupid];
        });

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    });
  }

  onCreateNewOrder() {
    console.log('create new order');
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
