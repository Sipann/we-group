import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.page.html',
  styleUrls: ['./group-manage.page.scss'],
})
export class GroupManagePage implements OnInit, OnDestroy {

  public group: Group;
  public groupid: string;
  private groupSub: Subscription;
  public managing: '' | 'info' | 'products' | 'summary' | 'users';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupid = paramMap.get('groupid');

      this.groupSub = this.store.select('groups')
        .pipe(map(groups => groups.groups))
        .subscribe(groups => {
          this.group = groups.find(group => group.id === this.groupid);
        });
    });
  }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
  }

  onCancel() { this.managing = ''; }

  onSelect(managing: '' | 'info' | 'products' | 'summary' | 'users') {
    this.managing = managing;
  }

}
