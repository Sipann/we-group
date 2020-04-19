import { Component, OnInit, Input } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.scss'],
})
export class GroupSummaryComponent implements OnInit {

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

}
