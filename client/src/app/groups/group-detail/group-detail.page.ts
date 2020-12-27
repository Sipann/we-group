import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';
import { GroupType } from 'src/app/models/refactor/group.model';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState, selectGroupWithId, selectGroupDetailsData } from 'src/app/store/reducers/index';

import { setUpLoader } from '../groups-utils';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit, OnDestroy {

  private currentUserIsManager = false;
  private group$: GroupType;
  private loadingCtrl: HTMLIonLoadingElement;
  public orderIsAllowed = false;

  private groupDetailsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.groupDetailsSub) this.groupDetailsSub.unsubscribe();
  }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.loadingCtrl = await setUpLoader(this.loadingController);
      this.loadingCtrl.present();

      this.groupDetailsSub = this.store.select(selectGroupDetailsData, { groupid: paramMap.get('groupid') })
        .subscribe(v => {
          // console.log('V =>', v);
          const { currentUser, group } = v;
          this.currentUserIsManager = currentUser && group && currentUser.userid === group.groupmanagerid;
          this.group$ = group;
        });

      if (this.loadingCtrl) this.loadingCtrl.dismiss();
    });
  }

  onNavigateToManageGroup() {
    if (this.currentUserIsManager) {
      // this.router.navigate(['/', 'groups', 'manage', this.group$.groupid], {
      //   state: { ...this.group$ }
      // });
      this.router.navigate(['/', 'groups', 'manage', this.group$.groupid]);
    }
  }

  onNavigateToPlaceOrder() {
    this.router.navigate(['/', 'orders', 'new', this.group$.groupid]);
  }

  onNavigateToOrdersArchives() {
    // this.router.navigate(['/', 'orders', 'group', this.group$.groupname]);
    this.router.navigate(['/', 'orders', 'group', this.group$.groupid]);
  }

}
