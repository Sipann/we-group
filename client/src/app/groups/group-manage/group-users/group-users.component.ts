import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducers';
import * as fromGroupsActions from '../../../store/actions/groups.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';



@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss'],
})
export class GroupUsersComponent implements OnInit {

  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupid: number;
  groupSub: Subscription;

  group$: Group;
  groupUsers: { name: string, id: string }[];
  groupMembers$: { name: string, id: string }[];

  private loadingCtrl: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private store: Store<AppState>,
  ) { }

  ngOnInit() { this.initialize(); }

  async initialize() {
    this.route.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupid = parseInt(paramMap.get('groupid'));

      await this.presentLoading();

      this.store.dispatch(new fromGroupsActions.FetchGroupMembers(this.groupid));

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.groups))
        .subscribe(groups => {
          this.group$ = groups.find(g => g.id == this.groupid);
          this.groupMembers$ = this.group$.members;
        });

      if (this.loadingCtrl) {
        this.loadingCtrl.dismiss();
        this.loadingCtrl = null;
      }
    });
  }

  onCancel() { this.cancelled.emit(); }

  onDelete(userid: string) { }


  async presentLoading() {
    this.loadingCtrl = await this.loadingController.create({
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return this.loadingCtrl.present();
  }

}
