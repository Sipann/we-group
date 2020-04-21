import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { ApiClientService } from '../services/api-client.service';
import { Group } from '../models/group.model';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {

  groups: Group[];
  userId: string;

  private authSub: Subscription;
  private groupsSub: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    private authService: AuthService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    // this.authSub = this.authService.getUserUid().subscribe(auth => {
    //   if (auth) {
    //     this.userId = auth.uid;
    //     this.fetchAllGroups();

    //   } else {
    //     console.log('logged out');
    //   }
    // });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.authSub = this.authService.getUserUid().subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        this.fetchAllGroups();

      } else {
        console.log('logged out');
      }
    });
  }


  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.groupsSub) this.groupsSub.unsubscribe();
  }

  fetchAllGroups() {
    this.apiClientService.getGroups()
      .subscribe((data: Group[]) => {
        this.groups = data;
        this.groups.forEach(group => {
          group.image = this.randomBgThumbnail();
        });
      });
  }

  onCreateGroup() {
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
        this.fetchAllGroups();
      });
  }

  randomBgThumbnail(): string {
    const rand = Math.floor((Math.random() * 7) + 1);  // 7 => number of available bg images in assets/bgThumbnail
    return `assets/bgThumbnail/${ rand }.png`;
  }
}
