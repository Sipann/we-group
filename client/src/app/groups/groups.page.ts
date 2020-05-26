import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import * as fromGroupsActions from '../store/actions/groups.actions';
import { GroupsState } from '../store/reducers/groups.reducers';
import { UserState } from '../store/reducers/user.reducers';

import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  groups$: Observable<Group[]>;
  user$: Observable<User>;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
  ) {
    this.groups$ = store.pipe(
      select('groups'),
      map((groupsState: GroupsState) => groupsState.groups)
    );

    this.user$ = store.pipe(
      select('user'),
      map((userState: UserState) => userState.currentUser)
    );
  }

  ngOnInit() { }

  onLaunchCreateGroupModal() {
    this.modalCtrl
      .create({
        component: NewGroupModalComponent,
        componentProps: {},
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        this.store.dispatch(new fromGroupsActions.ResetCreateGroup());
      });
  }

  onNavigateToGroup(groupid: number) {
    this.store.dispatch(new fromGroupsActions.SelectGroup({ groupid }));
  }

  tempBgThumbnail(i: number): string {
    return `assets/bgThumbnail/${ i % 7 }.png`;  // 7 => number of available bg images in assets/bgThumbnail
  }
}
