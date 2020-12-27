import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState, selectGroupsList } from '../store/reducers/index';
import * as fromGroupsActions from '../store/actions/groups.actions';

import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

import { GroupType } from 'src/app/models/refactor/group.model';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  public groups$: GroupType[] = [];
  private groupsDataSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.groupsDataSub = this.store.select(selectGroupsList)
      .subscribe((v) => {
        // console.log('GROUPS V =>', v);
        this.groups$ = v
      });
  }

  ngOnDestroy() {
    if (this.groupsDataSub) this.groupsDataSub.unsubscribe();
  }

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
        // this.store.dispatch(new fromGroupsActions.ResetCreateGroup());
      });
  }

  onNavigateToGroup(groupid: number) {
    // this.store.dispatch(new fromGroupsActions.SelectGroup({ groupid }));
  }

  tempBgThumbnail(i: number): string {
    // 7 => number of available bg images in assets/bgThumbnail
    return `assets/bgThumbnail/${ i % 7 }.png`;
  }
}
