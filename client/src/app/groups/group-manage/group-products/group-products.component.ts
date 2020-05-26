import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { NewProductModalComponent } from './new-product-modal/new-product-modal.component';

import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducers/index';
import { Subscription } from 'rxjs';
import * as fromGroupsActions from '../../../store/actions/groups.actions';

@Component({
  selector: 'app-group-products',
  templateUrl: './group-products.component.html',
  styleUrls: ['./group-products.component.scss'],
})
export class GroupProductsComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: true }) newProductform: NgForm;

  groupid: number;
  itemsForm: FormGroup = new FormGroup({});
  dateTimeFocus = true;
  group$: Group;

  private loadingCtrl: HTMLIonLoadingElement;

  routeSub: Subscription;
  groupSub: Subscription;


  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.groupSub) this.groupSub.unsubscribe();
  }

  async initialize() {

    this.routeSub = this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = parseInt(paramMap.get('groupid'));

      await this.presentLoading();

      this.store.dispatch(new fromGroupsActions.FetchGroupItems(this.groupid));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          const group = groups.find(g => g.id == this.groupid);
          this.createDynamicItemsList();
          this.itemsForm.updateValueAndValidity();   //? useful?
        })

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }

    });
  }


  createDynamicItemsList() {
    const itemsGroup = {};
    let items = [];
    if (this.group$) {
      itemsGroup['deadline'] = this.fb.group({
        'deadlineDate': [this.group$.deadline]
      });
      if (this.group$.items && this.group$.items.length) {
        items = this.group$.items;
        items.forEach(item => {
          const groupName = item.name;
          itemsGroup[groupName] = this.fb.group({
            'selected': [false],
            'amount': [item.remaining_qty],
            'name': [item.name],
            'price': [item.price],
            'currency': [item.currency]
          });
        });
      }
    }
    this.itemsForm = new FormGroup(itemsGroup);
  }

  onSelectDateIonChange(event) {
    if (this.dateTimeFocus) {
      this.dateTimeFocus = false;
      const newGroup = {
        ...this.group$,
        deadline: event.detail.value,
      };
      this.store.dispatch(new fromGroupsActions.UpdateGroup(newGroup))
    }
  }

  onDateTimeFocus() {
    this.dateTimeFocus = true;
  }


  onLaunchCreateItemModal() {
    this.modalCtrl
      .create({
        component: NewProductModalComponent,
        componentProps: { group: this.group$ },
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        this.store.dispatch(new fromGroupsActions.ResetAddItemModal())
      });
  }

  onDeleteItem(itemid: number) {
    this.store.dispatch(new fromGroupsActions.DeleteItem({ itemid, groupid: +this.groupid }));
    this.createDynamicItemsList();
  }

  onSendToGroup() {
    console.log('Send info to group members => ORDER IS NOW AVAILABLE');
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


}
