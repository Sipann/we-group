import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from 'src/app/models/group.model';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-groups-search',
  templateUrl: './groups-search.page.html',
  styleUrls: ['./groups-search.page.scss'],
})
export class GroupsSearchPage implements OnInit, OnDestroy {

  allGroups: Group[];
  otherGroups: Group[];
  userGroups: Group[];

  addUserSub: Subscription;
  allGroupsSub: Subscription;
  userGroupsSub: Subscription;

  constructor(
    private apiClientService: ApiClientService
  ) { }

  ngOnInit() {
    this.allGroupsSub = this.apiClientService.getAllGroups()
      .subscribe(data => {
        this.allGroups = data;
        this.userGroupsSub = this.apiClientService.getGroups()
          .subscribe(data => {
            this.userGroups = data;
            this.otherGroups = this.filter(this.allGroups, this.userGroups);
          });
      });
  }

  ngOnDestroy() {
    if (this.allGroupsSub) this.allGroupsSub.unsubscribe();
    if (this.addUserSub) this.addUserSub.unsubscribe();
    if (this.userGroupsSub) this.userGroupsSub.unsubscribe();
  }

  filter(allGroups, userGroups): Group[] {
    const keysAllGroups = [];
    const keysUserGroups = [];
    const keysOtherGroups = [];
    const otherGroups = [];

    allGroups.forEach(group => keysAllGroups.push(group.id));
    userGroups.forEach(group => keysUserGroups.push(group.id));
    keysAllGroups.forEach(key => {
      if (!keysUserGroups.includes(key)) keysOtherGroups.push(key);
    });
    allGroups.forEach(group => {
      if (keysOtherGroups.includes(group.id)) {
        group.image = this.randomBgThumbnail();
        otherGroups.push(group);
      }
    });
    return otherGroups;
  }

  randomBgThumbnail(): string {
    const rand = Math.floor((Math.random() * 7) + 1);  // 7 => number of available bg images in assets/bgThumbnail
    return `assets/bgThumbnail/${ rand }.png`;
  }

  onJoinGroup(group: Group, slidingEl: IonItemSliding) {
    this.addUserSub = this.apiClientService.addUserToGroup(group.id)
      .subscribe(data => {
        if (!!data) {
          this.otherGroups = this.otherGroups.filter(g => g.id !== group.id);
          this.userGroups.push(group);
        }
        slidingEl.close();
      })
  }

}
