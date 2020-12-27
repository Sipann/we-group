import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../../groups-utils';


@Component({
  selector: 'app-new-order-modal',
  templateUrl: './new-order-modal.component.html',
  styleUrls: ['./new-order-modal.component.scss'],
})
export class NewOrderModalComponent implements OnInit {

  @Input() groupid: string;
  //TODO @Input() available_orders: => pass from group-available-orders.page.ts to make sure that manager does not create an order that already exists.
  @ViewChild('f', { static: true }) form: NgForm;

  public deadlineTs: string;
  public deliveryTs: string;
  private loadingCtrl: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { }

  async onAddNewOrder() {
    const deadlineTs = this.form.value['deadline-ts'];
    const deliveryTs = this.form.value['delivery-ts'];

    if (new Date(deliveryTs) > new Date(deadlineTs)) {
      this.loadingCtrl = await setUpLoader(this.loadingController);

      // this.store.dispatch(new fromGroupsActions.CreateNewGroupOrder({
      //   groupid: this.groupid,
      //   newOrder: { deadlineTs, deliveryTs }
      // }));

      //TODO dismiss loadingCtrl when state is updated
      this.loadingCtrl.dismiss();
    }

    else {
      //TODO form validation to disable submit button
      console.log('dates make no sense');
    }
  }

  onCancel() {
    console.log('cancel');
    this.modalCtrl.dismiss();
  }

  // For testing TBD
  onDateChange($event) {
    console.log('date', $event.detail); //2020-06-02T11:16:12.784+02:00
  }

}
