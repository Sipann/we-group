import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/models/group.model';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AlertController, NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducers/index';
import { Subscription } from 'rxjs';
import * as fromGroupsActions from '../../../store/actions/groups.actions';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-group-infos',
  templateUrl: './group-infos.component.html',
  styleUrls: ['./group-infos.component.scss'],
})
export class GroupInfosComponent implements OnInit, OnDestroy {

  // @Input() group: Group;
  // @Input() managerName: string;
  // @Output() done = new EventEmitter<Group>();
  // @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupDesc: string;
  groupName: string;
  groupManager: string;

  routeSub: Subscription;
  groupSub: Subscription;
  groupid: number;

  group$: Group;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private store: Store<AppState>,
    // private apiClientService: ApiClientService,
  ) { }

  ngOnInit() {
    this.initialize();
    // this.groupDesc = this.group.description;
    // this.groupName = this.group.name;
    // this.groupManager = this.group.manager_id;
    // console.log('managerName from group-infos', this.managerName);
  }

  ngOnDestroy() { }


  async initialize() {
    this.routeSub = this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = parseInt(paramMap.get('groupid'));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          this.groupName = this.group$.name;
          this.groupDesc = this.group$.description;
          this.groupManager = this.group$.manager_id;
        });
    });
  }

  // onCancel() { this.cancelled.emit(); }

  deleteGroup(groupid: number) {

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
    // const updatedValues = {
    //   name: this.form.value['group-name'],
    //   description: this.form.value['group-description']
    // };
    const newGroup = {
      ...this.group$,
      name: this.form.value['group-name'],
      description: this.form.value['group-description']
    };
    this.store.dispatch(new fromGroupsActions.UpdateGroup(newGroup));

    // this.apiClientService.updateGroupInfos(updatedValues, this.group.id)
    //   .subscribe(data => {
    //     this.done.emit(data);
    //   });
  }


}
