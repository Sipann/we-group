import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';


import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from '../../models/group.model';
import { GroupInput } from '../../models/group-input.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers/index';
import * as fromGroupsActions from '../../store/actions/groups.actions';

@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss'],
})
export class NewGroupModalComponent implements OnInit {

  @Output() created = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupDescription: string;
  groupName: string;

  constructor(
    private apiClientService: ApiClientService,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) { }

  ngOnInit() { }

  onCancel() { this.modalCtrl.dismiss(null, 'cancel'); }

  onCreateGroup() {
    const group: GroupInput = {
      name: this.form.value['group-name'],
      description: this.form.value['group-description'],
      currency: this.form.value['group-currency']
    };
  }

  onAddGroup() {
    const group: GroupInput = {
      name: this.form.value['group-name'],
      description: this.form.value['group-description'],
      currency: this.form.value['group-currency']
    };


    this.apiClientService.createGroup(group)
      .subscribe(() => {
        this.created.emit(true);
        this.form.reset();
        this.modalCtrl.dismiss(group, 'confirm');
      });
  }

  onResetNewGroupForm() { this.form.reset(); }

}
