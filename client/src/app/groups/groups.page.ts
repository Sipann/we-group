import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

import { Store, select } from '@ngrx/store';
import * as fromGroupsActions from '../store/actions/groups.actions';
import { AppState } from '../store/reducers/index';
import { GroupsState } from '../store/reducers/groups.reducers';
import { UserState } from '../store/reducers/user.reducers';

import { AuthService } from '../services/auth.service';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {

  groups$: Observable<Group[]>;
  user$: Observable<User>;
  // userId: string;

  // uid$: string;

  // private authSub: Subscription;
  // private groupsSub: Subscription;

  constructor(
    // private authService: AuthService,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {
    this.groups$ = store.pipe(
      select('groups'),
      map((groupsState: GroupsState) => {
        console.log('GROUPS STATE', groupsState);   // eslint-disable-line no-console
        return groupsState.groups;
      })
    );

    // this.groups$ = store.pipe(
    //   select('groups'),
    //   map((groupsState: GroupsState) => groupsState.groups)
    // );

    this.user$ = store.pipe(
      select('user'),
      map((userState: UserState) => {
        console.log('USER STATE', userState);     // eslint-disable-line no-console
        return userState.currentUser;
      })
    );

  }

  ngOnInit() { }


  // getGroups(userid) {
  //   this.store.dispatch(new fromGroupsActions.LoadGroups(userid));
  // }


  // ionViewWillEnter() {
  //   this.authSub = this.authService.getUserUid().subscribe(auth => {
  //     if (auth) {
  //       this.userId = auth.uid;
  //       // this.fetchAllGroups();
  //     } else {
  //       console.log('logged out');
  //     }
  //   });
  // }


  ngOnDestroy() {
    // if (this.authSub) this.authSub.unsubscribe();
    // if (this.groupsSub) this.groupsSub.unsubscribe();
  }

  // fetchAllGroups() {
  //   this.apiClientService.getGroups()
  //     .subscribe((data: Group[]) => {
  //       this.groups = data;
  //       this.groups.forEach(group => {
  //         group.image = this.randomBgThumbnail();
  //       });
  //     });
  // }

  onCreateGroup() {
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
        // this.fetchAllGroups();
      });
  }

  tempBgThumbnail(i: number): string {
    return `assets/bgThumbnail/${ i % 7 }.png`;  // 7 => number of available bg images in assets/bgThumbnail
  }
}
