import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss'],
})
export class GroupUsersComponent implements OnInit {

  @Input() group: Group;
  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;
  groupUsers: { name: string, id: string }[];

  constructor() { }

  ngOnInit() {
    this.groupUsers = [
      { name: 'Mark', id: 'id1' },
      { name: 'Lili', id: 'id2' },
      { name: 'Lulu', id: 'id3' },
    ];
  }

  onCancel() { this.cancelled.emit(); }

  // onSaveChanges() {
  //   console.log('save changes with values');
  // }

  onDelete(userid: string) {
    console.log('deleteing user with id', userid);
  }

}
