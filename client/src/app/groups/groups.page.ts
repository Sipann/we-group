import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { ApiClientService } from '../services/api-client.service';
import { Group } from '../models/group.model';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';

import { AuthService } from '../services/auth.service';
import { take, switchMap } from 'rxjs/operators';

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
    if (this.groupsSub) this.groupsSub.unsubscribe();
  }

  fetchAllGroups() {
    this.apiClientService.getGroups()
      .subscribe((data: Group[]) => {
        this.groups = data;
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
}
