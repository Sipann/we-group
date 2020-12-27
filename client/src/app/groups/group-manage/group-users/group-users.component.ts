import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoadingController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState, selectGroupWithId } from 'src/app/store/reducers';
import { fromGroupsActions } from 'src/app/store/actions';

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

  public groupMembers$: { username: string, userid: string, manager?: boolean }[]; // TODO
  public groupManager$: { username: string, userid: string, manager?: boolean };  // TODO
  public managerId$: string;
  private groupid: string;
  private groupSub: Subscription;
  private groupMembersSub: Subscription;
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
    if (this.groupMembersSub) this.groupMembersSub.unsubscribe();
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

      this.groupMembersSub = this.store.select(selectGroupWithId, { id: paramMap.get('groupid') })
        .subscribe((v) => {
          const managerId = v.groupmanagerid;
          this.groupMembers$ = [...v.groupmembers].filter(member => member.userid !== managerId);
          this.groupManager$ = v.groupmembers.find(member => member.userid === managerId);
        })

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    });
  }

  onCancel() { this.cancelled.emit(); }

  onRemoveMemberFromGroup(userid: string, manager?: boolean) {
    if (manager) return;
    // this.store.dispatch(new fromGroupsActions.RemoveMemberFromGroup({ groupid: this.groupid, removedUserid: userid }));
  }

}
