import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/index';
import * as fromGroupsActions from 'src/app/store/actions/groups.actions';

import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss'],
})
export class NewGroupModalComponent implements OnInit {

  // @Output() created = new EventEmitter();
  @ViewChild('f', { static: true }) form: NgForm;

  public groupDescription: string;
  public groupName: string;

  private createGroupSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {
    this.createGroupSub = this.store.select('groups')
      .pipe(map(s => s.groupCreated))
      .subscribe(v => {
        if (v) {
          // this.created.emit(true);  // useful?
          this.form.reset();
          this.modalCtrl.dismiss();
        }
      })
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.createGroupSub) this.createGroupSub.unsubscribe();
  }

  onCancel() { this.modalCtrl.dismiss(); }

  onAddGroup() {
    const group: Group = {
      name: this.form.value['group-name'],
      description: this.form.value['group-description'],
      currency: this.form.value['group-currency']
    };
    this.store.dispatch(new fromGroupsActions.CreateGroup(group));
  }

  onResetNewGroupForm() { this.form.reset(); }

}
