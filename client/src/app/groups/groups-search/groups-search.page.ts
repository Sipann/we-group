import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IonItemSliding } from '@ionic/angular';
// import { ApiClientService } from 'src/app/services/api-client.service';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { setUpLoader } from '../groups-utils';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-groups-search',
  templateUrl: './groups-search.page.html',
  styleUrls: ['./groups-search.page.scss'],
})
export class GroupsSearchPage implements OnInit, OnDestroy {

  private loadingCtrl: HTMLIonLoadingElement;
  public availableGroups$: Group[];

  allGroups: Group[];
  otherGroups: Group[];
  userGroups: Group[];

  // addUserSub: Subscription;
  private otherGroupsSub: Subscription;
  // userGroupsSub: Subscription;

  constructor(
    // private apiClientService: ApiClientService
    private loadingController: LoadingController,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.initialize();
    // this.allGroupsSub = this.apiClientService.getAllGroups()
    //   .subscribe(data => {
    //     this.allGroups = data;
    //     this.userGroupsSub = this.apiClientService.getGroups()
    //       .subscribe(data => {
    //         this.userGroups = data;
    //         this.otherGroups = this.filter(this.allGroups, this.userGroups);
    //       });
    //   });
  }

  async initialize() {

    // this.store.dispatch(new fromGroupsActions.FetchOtherGroups());

    this.loadingCtrl = await setUpLoader(this.loadingController);
    this.loadingCtrl.present();

    // this.otherGroupsSub = this.store.select('groups')
    //   .pipe(map(g => g.availableGroups))
    //   .subscribe(availableGroups => {
    //     this.availableGroups$ = availableGroups;
    //     if (this.loadingCtrl) this.loadingCtrl.dismiss();
    //   })
  }

  ngOnDestroy() {
    if (this.otherGroupsSub) this.otherGroupsSub.unsubscribe();
    // if (this.addUserSub) this.addUserSub.unsubscribe();
    // if (this.userGroupsSub) this.userGroupsSub.unsubscribe();
  }

  // filter(allGroups, userGroups): Group[] {
  //   const keysAllGroups = [];
  //   const keysUserGroups = [];
  //   const keysOtherGroups = [];
  //   const otherGroups = [];

  //   allGroups.forEach(group => keysAllGroups.push(group.id));
  //   userGroups.forEach(group => keysUserGroups.push(group.id));
  //   keysAllGroups.forEach(key => {
  //     if (!keysUserGroups.includes(key)) keysOtherGroups.push(key);
  //   });
  //   allGroups.forEach(group => {
  //     if (keysOtherGroups.includes(group.id)) {
  //       group.image = this.randomBgThumbnail();
  //       otherGroups.push(group);
  //     }
  //   });
  //   return otherGroups;
  // }

  randomBgThumbnail(): string {
    const rand = Math.floor((Math.random() * 7) + 1);  // 7 => number of available bg images in assets/bgThumbnail
    return `assets/bgThumbnail/${ rand }.png`;
  }

  onJoinGroup(group: Group, slidingEl: IonItemSliding) {

    // this.store.dispatch(new fromGroupsActions.AddMemberToGroup({ groupid: group.id }));

    // this.addUserSub = this.apiClientService.addUserToGroup(group.id)
    //   .subscribe(data => {
    //     if (!!data) {
    //       this.otherGroups = this.otherGroups.filter(g => g.id !== group.id);
    //       this.userGroups.push(group);
    //     }
    //     slidingEl.close();
    //   })
  }

}
