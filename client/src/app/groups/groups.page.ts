import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GroupsService } from '../services/groups.service';
import { Group } from '../models/group.model';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {

  groups: Group[];
  private groupsSub: Subscription;

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsSub = this.groupsService.groups.subscribe(groups => {
      this.groups = groups;
    });
  }

  ngOnDestroy() {
    if (this.groupsSub) this.groupsSub.unsubscribe();
  }

  onCreateGroup() {
    console.log('create new group');
  }
}
