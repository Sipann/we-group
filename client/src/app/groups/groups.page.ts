import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { ApiClientService } from '../services/api-client.service';
import { Group } from '../models/group.model';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {

  groups: Group[];
  private groupsSub: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.fetchAllGroups();
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
