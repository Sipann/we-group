import { Component, OnInit, Input } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { Order } from '../../../models/order.model';
import { Group } from 'src/app/models/group.model';

import * as moment from 'moment';


@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.scss'],
})
export class GroupSummaryComponent implements OnInit {

  @Input() group: Group;
  @Input() summaryByUser: [];
  @Input() summaryByItem: [];
  empty = true;
  summaries: [];
  display: string = 'items';

  constructor() { }

  ngOnInit() {
    if (this.summaryByItem.length) {
      this.summaries = this.summaryByItem;
      this.empty = false;
    }
  }

  summaryDisplayChanged(e: CustomEvent<SegmentChangeEventDetail>) {
    this.display = e.detail.value;
  }

  formatDate(deadline) {
    return moment(new Date(deadline)).format('Do MMM YYYY - hh:mm a');
  }

}
