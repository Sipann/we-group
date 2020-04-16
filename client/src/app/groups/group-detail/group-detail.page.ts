import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit, OnDestroy {

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

}
