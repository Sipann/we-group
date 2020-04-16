import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.page.html',
  styleUrls: ['./group-manage.page.scss'],
})
export class GroupManagePage implements OnInit, OnDestroy {

  managing: string = '';
  group: Group;
  private groupSub: Subscription;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private groupsService: GroupsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupSub = this.groupsService.getGroup(parseInt(paramMap.get('groupid'))).subscribe(group => {
        this.group = group;
      });
    });
  }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
  }

  onSelect(managing: string) {
    this.managing = managing;
  }

  onCancel() { this.managing = ''; }
}
