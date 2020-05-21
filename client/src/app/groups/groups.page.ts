import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../store';
// import { GroupState } from '../store/reducers/groups.reducers';
import { AppState } from '../store/reducers/index';
import { initialState, GroupsState } from '../store/reducers/groups.reducers';
import { UserState } from '../store/reducers/user.reducers';
import * as fromGroupsActions from '../store/actions/groups.actions';

// import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';

import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {

  groups$: Observable<Group[]>;
  userId: string;

  user$: Observable<User>;
  uid$: string;

  private authSub: Subscription;
  private groupsSub: Subscription;

  constructor(
    // private apiClientService: ApiClientService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {
    this.groups$ = store.pipe(
      select('groups'),
      map((groupsState: GroupsState) => {
        console.log('GROUPS STATE', groupsState);
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
        console.log('USER STATE', userState);
        // this.uid$ = userState.currentUser.id;
        return userState.currentUser;
      })
    );

  }

  ngOnInit() {
    // this.getGroups(this.uid$);

    // this.authSub = this.authService.getUserUid().subscribe(auth => {
    //   if (auth) {
    //     this.userId = auth.uid;
    //     this.fetchAllGroups();

    //   } else {
    //     console.log('logged out');
    //   }
    // });
  }




  getGroups(userid) {
    this.store.dispatch(new fromGroupsActions.LoadGroups(userid));
  }


  ionViewWillEnter() {
    // console.log('ION VIEW WILL ENTER AUTH SUB');
    this.authSub = this.authService.getUserUid().subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        // this.fetchAllGroups();
      } else {
        console.log('logged out');
      }
    });
  }


  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.groupsSub) this.groupsSub.unsubscribe();
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

  randomBgThumbnail(): string {
    const rand = Math.floor((Math.random() * 7) + 1);  // 7 => number of available bg images in assets/bgThumbnail
    return `assets/bgThumbnail/${ rand }.png`;
  }
}
