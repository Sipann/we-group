import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { LoadingController, NavController } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../groups-utils';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.scss'],
})
export class GroupSummaryComponent implements OnInit, OnDestroy {

  @Input() deadline: string;

  public display: string = 'items';
  public empty = true;
  public group$: Group;
  private groupid: string;
  private loadingCtrl: HTMLIonLoadingElement;
  public ordersDates: string[];

  private groupSub: Subscription;

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = paramMap.get('groupid');

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          if (this.group$.orders) {
            this.ordersDates = Object.keys(this.group$.orders);
            this.empty = !this.ordersDates.length;
          }

          if (this.loadingCtrl) {
            this.loadingCtrl.dismiss();
            this.loadingCtrl = null;
          }
        })

      this.store.dispatch(new fromGroupsActions.FetchGroupOrders({ groupid: this.groupid }));
    })
  }

  formatDate(deadline: string) {
    return moment(new Date(deadline)).format('Do MMM YYYY - hh:mm a');
  }

  onNavigateToOrderDetails(date: string) {
    this.router.navigate(['/', 'groups', 'manage', this.groupid, date]);
  }

  summaryDisplayChanged(e: CustomEvent<SegmentChangeEventDetail>) {
    this.display = e.detail.value;
  }
}
