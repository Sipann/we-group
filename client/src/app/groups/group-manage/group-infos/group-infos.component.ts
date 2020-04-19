import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/models/group.model';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-group-infos',
  templateUrl: './group-infos.component.html',
  styleUrls: ['./group-infos.component.scss'],
})
export class GroupInfosComponent implements OnInit {

  @Input() group: Group;
  @Output() done = new EventEmitter<Group>();
  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupDesc: string;
  groupName: string;
  groupManager: string;

  constructor(
    private alertCtrl: AlertController,
    private apiClientService: ApiClientService,
  ) { }

  ngOnInit() {
    this.groupDesc = this.group.description;
    this.groupName = this.group.name;
    this.groupManager = this.group.manager_id;
  }

  onCancel() { this.cancelled.emit(); }

  deleteGroup(groupid: number) {

  }

  onDeleteGroup() {
    const message = `This will permanently delete the ${ this.group.name } group. If you don't want to manage this group anymore, you can ask another member to be in charge of it.`;
    this.alertCtrl.create({
      header: 'Are You Sure?',
      message: message,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete It!',
          role: 'confirm',
          handler: () => this.deleteGroup(this.group.id)
        }
      ]
    })
      .then(alertEl => alertEl.present());
  }

  onUpdateGroup() {
    const updatedValues = {
      name: this.form.value['group-name'],
      description: this.form.value['group-description']
    };

    this.apiClientService.updateGroupInfos(updatedValues, this.group.id)
      .subscribe(data => {
        this.done.emit(data);
      });

  }

}
