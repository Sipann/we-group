import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { User } from '../../models/user.model';


import { map, tap } from 'rxjs/operators';

import { ApiClientService } from 'src/app/services/api-client.service';
import { GroupService } from 'src/app/services/group.service';

import { GroupInput } from '../../models/group-input.model';

import { Store, select } from '@ngrx/store';
import { AppState, selectUserCurrent } from '../../store/reducers/index';
import { UserState } from '../../store/reducers/user.reducers';
import * as fromGroupsActions from '../../store/actions/groups.actions';

@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss'],
})
export class NewGroupModalComponent implements OnInit {

  @Output() created = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupDescription: string;
  groupName: string;

  user$: User;
  userSub: Subscription;
  createGroupSub: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    private groupService: GroupService,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {
    this.userSub = this.store.select(selectUserCurrent)
      .pipe(map(user => User.parse(user)))
      .subscribe(v => this.user$ = v);
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.createGroupSub) this.createGroupSub.unsubscribe();
  }

  onCancel() { this.modalCtrl.dismiss(null, 'cancel'); }

  onAddGroup() {
    const group: GroupInput = {
      name: this.form.value['group-name'],
      description: this.form.value['group-description'],
      currency: this.form.value['group-currency']
    };

    this.store.dispatch(new fromGroupsActions.CreateGroup(group));
    //TODO form reset and dismiss modalCtrl

    // this.apiClientService.createGroup(group)
    //   .subscribe(() => {
    //     this.created.emit(true);
    //     this.form.reset();
    //     this.modalCtrl.dismiss(group, 'confirm');
    //   });
  }

  onResetNewGroupForm() { this.form.reset(); }

}
