import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from 'src/app/models/group.model';
import { Item } from '../../models/item.model';
import { OrderSumup } from 'src/app/models/order-sumup.model';
import { User } from '../../models/user.model';

import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducers/index';
import * as fromGroupsActions from '../../store/actions/groups.actions';


@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.page.html',
  styleUrls: ['./group-manage.page.scss'],
})
export class GroupManagePage implements OnInit, OnDestroy {

  loading_infos = true;
  loading_items = true;
  loading_members = true;
  loading_summary = true;

  groupId: number;
  managerName: string;
  managing: '' | 'info' | 'products' | 'summary' | 'users';
  members: User[];
  summaryByItem: {}[];
  summaryByUser: {}[];

  items: Item[];
  group: Group;

  private infosSub: Subscription;
  private itemsSub: Subscription;
  private membersSub: Subscription;
  private summarySub: Subscription;

  private groupSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private navCtrl: NavController,
    private router: Router,
    private store: Store<AppState>) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.selectedGroup))
        .subscribe(selectedGroupData => {
          this.group = selectedGroupData;
        })


      if (this.router.getCurrentNavigation().extras.state) {
        const group = this.router.getCurrentNavigation().extras.state;
        this.group = Group.parse(group);

        this.loading_infos = false;
        // this.fetchItems();
        // this.fetchMembers();
        // this.fetchSummary();


      }
      else {
        this.router.navigate(['/', 'groups', 'detail', this.groupId]);
        return;
      }

    });
  }

  ngOnDestroy() {
    if (this.infosSub) this.infosSub.unsubscribe();
    if (this.itemsSub) this.itemsSub.unsubscribe();
    if (this.membersSub) this.membersSub.unsubscribe();
    if (this.summarySub) this.summarySub.unsubscribe();
  }


  fetchGroupInfos() {
    this.infosSub = this.apiClientService.getGroup(this.group.id)
      .subscribe(data => {
        this.group = data;
      });
  }

  fetchItems() {
    this.itemsSub = this.apiClientService.getGroupItems(this.group.id)
      .subscribe(data => {
        this.items = data;
        this.loading_items = false;
      });
  }

  fetchMembers() {
    this.membersSub = this.apiClientService.getGroupMembers(this.group.id)
      .subscribe(data => {
        this.members = data;
        this.loading_members = false;
        const manager = data.find(member => member.id === this.group.manager_id);
        this.managerName = manager.name;
      });
  }

  fetchSummary() {
    if (this.group.deadline) {
      this.summarySub = this.apiClientService.getGroupOrder(this.group.id, this.group.deadline)
        .subscribe(data => {
          this.summaryByUser = this.reduceByUser(data);
          this.summaryByItem = this.reduceByItem(data);
          this.loading_summary = false;
        });
    }

  }

  onCancel() { this.managing = ''; }

  onDone(group: Group) {
    this.managing = '';
    this.group = group;
    this.fetchSummary();
  }

  onItemsUpdated() { this.fetchItems(); }

  onSelect(managing: '' | 'info' | 'products' | 'summary' | 'users') {
    this.managing = managing;
  }

  reduceByUser(data: OrderSumup[]): {}[] {
    const result = [];
    const reduced = data.reduce((acc, current) => {
      const currentUsername = current.username;
      const item = { itemname: current.itemname, orderedquantity: current.orderedquantity };
      return acc[currentUsername]
        ? acc = { ...acc, [currentUsername]: [...acc[currentUsername], item] }
        : acc = { ...acc, [currentUsername]: [item] }
    }, {});

    for (let prop in reduced) {
      if (reduced.hasOwnProperty(prop)) {
        result.push({ username: prop, items: reduced[prop] });
      }
    }
    return result;
  }

  reduceByItem(data: OrderSumup[]): {}[] {
    const result = [];
    const reduced = data.reduce((acc, current) => {
      const currentItemname = current.itemname;
      const currentQuantity = current.orderedquantity;
      return acc[currentItemname]
        ? acc = { ...acc, [currentItemname]: acc[currentItemname] + currentQuantity }
        : acc = { ...acc, [currentItemname]: currentQuantity }
    }, {});

    for (let prop in reduced) {
      if (reduced.hasOwnProperty(prop)) {
        result.push({
          itemname: prop,
          quantity: reduced[prop]
        });
      }
    }
    return result;
  }
}
