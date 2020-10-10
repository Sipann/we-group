import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoadingController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../../groups-utils';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss'],
})
export class GroupUsersComponent implements OnInit, OnDestroy {

  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  private group$: Group;
  private groupid: string;
  public groupMembers$: { username: string, userid: string, manager?: boolean }[];
  private groupSub: Subscription;
  private loadingCtrl: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
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

      this.store.dispatch(new fromGroupsActions.FetchGroupMembers({ groupid: this.groupid }));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          this.groupMembers$ = this.group$.members;

          if (this.loadingCtrl) {
            this.loadingCtrl.dismiss();
            this.loadingCtrl = null;
          }
        });
    });
  }

  onCancel() { this.cancelled.emit(); }

  onRemoveMemberFromGroup(userid: string, manager?: boolean) {
    if (manager) return;
    this.store.dispatch(new fromGroupsActions.RemoveMemberFromGroup({ groupid: this.groupid, removedUserid: userid }));
  }

}
