import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/reducers/index';
import * as fromGroupsActions from '../../../store/actions/groups.actions';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-group-infos',
  templateUrl: './group-infos.component.html',
  styleUrls: ['./group-infos.component.scss'],
})
export class GroupInfosComponent implements OnInit, OnDestroy {

  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  private group$: Group;
  private groupid: string;
  public groupDesc: string;
  public groupName: string;
  public groupManager: string;

  private groupSub: Subscription;
  private routeSub: Subscription;

  public submitBtnLabel = 'SAVE CHANGES';

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  async initialize() {
    this.routeSub = this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = paramMap.get('groupid');

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id === this.groupid);
          this.groupName = this.group$.name;
          this.groupDesc = this.group$.description;
          this.groupManager = this.group$.manager_id;
          this.form.form.markAsPristine();
        });
    });
  }

  onCancel() { this.cancelled.emit(true); }

  deleteGroup(groupid: string) {
    //TODO
  }

  onDeleteGroup() {
    const message = `This will permanently delete the ${ this.groupName } group. If you don't want to manage this group anymore, you can ask another member to be in charge of it.`;
    this.alertCtrl.create({
      header: 'Are You Sure?',
      message: message,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete It!',
          role: 'confirm',
          handler: () => this.deleteGroup(this.group$.id)
        }
      ]
    })
      .then(alertEl => alertEl.present());
  }

  onUpdateGroup() {
    const newGroup = {
      ...this.group$,
      name: this.form.value['group-name'],
      description: this.form.value['group-description']
    };
    this.store.dispatch(new fromGroupsActions.UpdateGroup(newGroup));
  }


}
