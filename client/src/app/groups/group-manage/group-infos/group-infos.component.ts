import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-group-infos',
  templateUrl: './group-infos.component.html',
  styleUrls: ['./group-infos.component.scss'],
})
export class GroupInfosComponent implements OnInit {

  @Input() group: Group;
  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;
  groupName: string;
  groupDesc: string;
  groupManager: string;

  constructor() { }

  ngOnInit() {
    this.groupName = this.group.name;
    this.groupDesc = this.group.description;
    this.groupManager = this.group.manager_id;
    console.log('this.form', this.form);
  }

  onCancel() {
    console.log('canceling modifications');
    this.cancelled.emit();
  }

  onSaveChanges() {
    console.log('save changes with values', this.form.value['group-name'], this.form.value['group-description'], this.form.value['manager-name']);
  }

}
