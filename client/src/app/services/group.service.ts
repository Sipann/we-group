import { Group } from '../models/group.model';
import { GroupInput } from 'src/app/models/group-input.model';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


import { User } from '../models/user.model';
import { Member } from '../models/member.model';
import { Item } from '../models/item.model';
import { AvailableItem } from '../models/available-item.model';
import { Response } from '../models/common.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { GroupOrderAvailable, GroupAvailableOrders } from 'src/app/models/group-order-available.model';
import { Store, } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import { selectUserCurrent } from '../store/reducers/index';
import { catchError, map } from 'rxjs/operators';

import { handleError } from './utils';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = environment.apiBaseUrl;

  user$: User;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private store: Store<AppState>,
  ) {
    this.store.select(selectUserCurrent)
      .pipe(map(user => User.parse(user)))
      .subscribe(v => this.user$ = v);
  }

  addNewItem(payload: { orderid: string, item: Item }): Observable<Response<AvailableItem>> {
    const fullUrl = `${ this.baseUrl }/groups/available-order/new-item/${ payload.orderid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Response<AvailableItem>>(fullUrl, payload.item, { headers });
  }

  addExistingItem(payload: { orderid: string, item: Item }) {
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Response<AvailableItem>>('', payload.item, { headers });
  }

  deleteItem(itemid: string): Observable<string> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ itemid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.delete<string>(fullUrl, { headers });
  }

  // route not targeted
  // fetchAvailableItems(payload: { orderid: string }): Observable<> {
  fetchAvailableItems(payload: { orderid: string }) {
    const fullUrl = `${ this.baseUrl }/test/groups/orders/items/${ payload.orderid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    // return this.httpClient.get<>(fullUrl, { headers });
    return this.httpClient.get(fullUrl, { headers });
  }

  fetchItems(groupid: string): Observable<Item[]> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Item[]>(fullUrl, { headers })
      .pipe(map(itemArr => itemArr.map(item => Item.parse(item))));
  }


  fetchMembers(groupid: string): Observable<{ ok: boolean, payload: Member[] }> {
    const fullUrl = `${ this.baseUrl }/groups/members/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<{ ok: boolean, payload: Member[] }>(fullUrl, { headers });
  }

  updateGroup(group: Group): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.put<Group>(fullUrl, group, { headers })
      .pipe(map(group => Group.parse(group)));
  }

  // not targeting any route
  // fetchGroupAvailableItems(groupid: string): Observable<> {
  fetchGroupAvailableItems(groupid: string) {
    const fullUrl = `${ this.baseUrl }/`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    // return this.httpClient.get<>(fullUrl, { headers });
    return this.httpClient.get(fullUrl, { headers });
  }

  // not targeting any route
  setGroupAvailableItems(payload: { groupid: string, item: Item }): Observable<Item> {
    const fullUrl = `${ this.baseUrl }/test/groups/items`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Item>(fullUrl, payload, { headers })
      .pipe(map(item => Item.parse(item)));
  }

  addMemberToGroup(groupid: string): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups/user/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Group>(fullUrl, null, { headers });
  }

  createGroup(newGroup: GroupInput): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Group>(fullUrl, newGroup, { headers })
      .pipe(
        map(response => Group.parse(response)),
        catchError(handleError)
      );
  };

  createNewGroupOrder(payload: {
    groupid: string,
    newOrder: { deadlineTs: string, deliveryTs: string }
  }): Observable<GroupOrderAvailable> {
    const fullUrl = `${ this.baseUrl }/groups/available-order/${ payload.groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<GroupOrderAvailable>(fullUrl, payload.newOrder, { headers });
  }

  fetchAvailableOrders(payload: { groupid: string }): Observable<{ ok: boolean, payload: GroupAvailableOrders }> {
    const fullUrl = `${ this.baseUrl }/groups/available-orders/${ payload.groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<{ ok: boolean, payload: GroupAvailableOrders }>(fullUrl, { headers });
  }

  fetchGroupOrders(groupid: string): Observable<GroupOrderDB[]> {
    // orders/placed/all /: availableorderid
    // const fullUrl = `${ this.baseUrl }/orders/group/${ groupid }`;
    // const fullUrl = `${ this.baseUrl }orders/placed/all/${ availableorderid }`;
    const fullUrl = '';
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<GroupOrderDB[]>(fullUrl, { headers });
  }

  fetchOtherGroups(): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups/search`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Group[]>(fullUrl, { headers })
      .pipe(map(groupsArr => groupsArr.map(group => Group.parse(group))));
  }

  removeMemberFromGroup(payload: { groupid: string, removedUserid: string }): Observable<{ ok: boolean, payload: boolean }> {
    const fullUrl = `${ this.baseUrl }/groups/remove-member/${ payload.groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.put<{ ok: boolean, payload: boolean }>(fullUrl, { removedUserid: payload.removedUserid }, { headers });
  }

  fetchStaticManageGroupData(
    payload: { groupid: string }
  ): Observable<Response<{ groupMembers: Member[], groupAvailableOrders: GroupAvailableOrders }>> {
    const fullUrl = `${ this.baseUrl }/groups/manage/${ payload.groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Response<{ groupMembers: Member[], groupAvailableOrders: GroupAvailableOrders }>>(fullUrl, { headers });
  }


  // EXTRACTED

  // addItem(payload: { groupid: string, item: Item }): Observable<Item> {
  //   const fullUrl = `${ this.baseUrl }/groups/items`;
  //   const headers = new HttpHeaders().append('userid', this.user$.id);
  //   return this.httpClient.post<Item>(fullUrl, payload, { headers })
  //     .pipe(map(item => Item.parse(item)));
  // }



  // getGroups(userid: string): Observable<Group[]> {
  //   const fullUrl = `${ this.baseUrl }/groups`;
  //   const headers = new HttpHeaders().append('userid', '9tO9WsqEqyRBP4HkZXH5NNexZ5P2');
  //   return this.httpClient.get<Group[]>(fullUrl, { headers });
  // }

}