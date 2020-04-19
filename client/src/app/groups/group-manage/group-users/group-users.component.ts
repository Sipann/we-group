import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss'],
})
export class GroupUsersComponent implements OnInit {

  // @Input() group: Group;
  @Input() members: User[];
  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  groupId: number;
  groupUsers: { name: string, id: string }[];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.groupId = parseInt(paramMap.get('groupid'));
    });
  }

  onCancel() { this.cancelled.emit(); }

  onDelete(userid: string) { }

}
