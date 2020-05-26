import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { LoadingController, NavController } from '@ionic/angular';

import { Order } from '../../../models/order.model';
import { Group } from 'src/app/models/group.model';

import * as moment from 'moment';

import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducers';
import * as fromGroupsActions from '../../../store/actions/groups.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.scss'],
})
export class GroupSummaryComponent implements OnInit, OnDestroy {

  @Input() deadline: string;
  empty = true;

  summaries: [];
  display: string = 'items';

  groupid: number;
  private loadingCtrl: HTMLIonLoadingElement;

  groupSub: Subscription;
  group$: Group;

  constructor(
    private store: Store<AppState>,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = parseInt(paramMap.get('groupid'));

      await this.presentLoading();

      this.store.dispatch(new fromGroupsActions.FetchGroupSummary(this.groupid));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          if (this.group$.order) this.empty = !this.group$.order.byItem.length;
        })

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    })
  }

  summaryDisplayChanged(e: CustomEvent<SegmentChangeEventDetail>) {
    this.display = e.detail.value;
  }

  formatDate(deadline) {
    return moment(new Date(deadline)).format('Do MMM YYYY - hh:mm a');
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
