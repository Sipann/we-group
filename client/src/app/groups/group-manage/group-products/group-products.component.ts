import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';

import { ModalController, LoadingController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { Group } from 'src/app/models/group.model';
import { NewProductModalComponent } from './new-product-modal/new-product-modal.component';

import { setUpLoader } from '../../groups-utils';


@Component({
  selector: 'app-group-products',
  templateUrl: './group-products.component.html',
  styleUrls: ['./group-products.component.scss'],
})
export class GroupProductsComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: true }) newProductform: NgForm;

  private dateTimeFocus = true;
  public group$: Group;
  private groupid: string;
  public itemsForm: FormGroup = new FormGroup({});
  private loadingCtrl: HTMLIonLoadingElement;

  private routeSub: Subscription;
  private groupSub: Subscription;


  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
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
      this.groupid = paramMap.get('groupid');

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.store.dispatch(new fromGroupsActions.FetchGroupItems({ groupid: this.groupid }));

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

  onDeleteItem(itemid: string) {
    console.log('onDeleteItem, itemid:', itemid, 'type:', typeof (itemid));
    this.store.dispatch(new fromGroupsActions.DeleteItem({ itemid, groupid: this.groupid }));
    this.createDynamicItemsList();
  }

  onSendToGroup() {
    //TODO
    console.log('Send info to group members => ORDER IS NOW AVAILABLE');
  }

}
