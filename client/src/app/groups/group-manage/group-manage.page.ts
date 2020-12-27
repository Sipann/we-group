import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState, selectGroupWithId } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { Group } from 'src/app/models/group.model';
import { GroupType } from 'src/app/models/refactor/group.model';


enum ManagingScreen {
  NONE = 'none',
  INFO = 'info',
  PRODUCTS = 'products',
  SUMMARY = 'summary',
  USERS = 'users',
}

@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.page.html',
  styleUrls: ['./group-manage.page.scss'],
})
export class GroupManagePage implements OnInit, OnDestroy {

  public group: Group;
  public group$: GroupType;
  public groupid: string;
  private groupManageSub: Subscription;
  // public managing: '' | 'info' | 'products' | 'summary' | 'users';
  public managing: ManagingScreen = ManagingScreen.NONE;

  public get ManagingScreen() {
    return ManagingScreen;
  }

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }


  ngOnInit() {
    // console.log('LAND ON manage page');

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');

      // this.store.dispatch(new fromGroupsActions.FetchStaticManageGroupData({ groupid: this.groupid }));
      this.groupManageSub = this.store.select(selectGroupWithId, { id: paramMap.get('groupid') }).subscribe((v) => {
        console.log('Group Manage v =>', v);
        this.group$ = v;
      });
    });
  }

  ngOnDestroy() {
    if (this.groupManageSub) this.groupManageSub.unsubscribe();
  }

  // onCancel() { this.managing = ''; }
  onCancel() { this.managing = ManagingScreen.NONE; }

  onNavigateToAvailableOrders() {
    this.router.navigate(['/', 'groups', 'manage', this.group$.groupid, 'available-orders']);
  }

  // onSelect(managing: '' | 'info' | 'products' | 'summary' | 'users') {
  //   this.managing = managing;
  // }
  onSelect(managing: ManagingScreen) {
    this.managing = managing;
  }

}
