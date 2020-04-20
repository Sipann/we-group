import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { ApiClientService } from 'src/app/services/api-client.service';
import { GroupInput } from '../../models/group-input.model';

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
    private modalCtrl: ModalController) { }

  ngOnInit() { }

  onCancel() { this.modalCtrl.dismiss(null, 'cancel'); }

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
