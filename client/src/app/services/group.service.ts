import { Group } from '../models/group.model';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { GroupInput } from '../models/group-input.model';

import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { Order } from '../models/order.model';
import { OrderSumup } from '../models/order-sumup.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import { selectUserCurrent } from '../store/reducers/index';
import { GroupsState } from '../store/reducers/groups.reducers';
import { UserState } from '../store/reducers/user.reducers';
import { map, tap } from 'rxjs/operators';
import { ItemInput } from '../models/item-input.model';

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



  getGroups(userid: string): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', '9tO9WsqEqyRBP4HkZXH5NNexZ5P2');
    return this.httpClient.get<Group[]>(fullUrl, { headers });
  }

  //

  addItem(payload: { groupid: string, item: Item }): Observable<Item> {
    const fullUrl = `${ this.baseUrl }/groups/items`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Item>(fullUrl, payload, { headers })
      .pipe(map(item => Item.parse(item)));
  }

  addMemberToGroup(groupid: string): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups/user/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Group>(fullUrl, null, { headers });
  }


  createGroup(newGroup: Group): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Group>(fullUrl, newGroup, { headers });
  }


  deleteItem(itemid: string): Observable<string> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ itemid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.delete<string>(fullUrl, { headers });
  }


  fetchItems(groupid: string): Observable<Item[]> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Item[]>(fullUrl, { headers })
      .pipe(map(itemArr => itemArr.map(item => Item.parse(item))));
  }


  fetchMembers(groupid: string): Observable<User[]> {
    const fullUrl = `${ this.baseUrl }/groups/members/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<User[]>(fullUrl, { headers })
      .pipe(map(usersArr => usersArr.map(user => User.parse(user))));
  }


  fetchOtherGroups(): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups/search`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Group[]>(fullUrl, { headers })
      .pipe(map(groupsArr => groupsArr.map(group => Group.parse(group))));
  }


  fetchGroupOrders(groupid: string): Observable<GroupOrderDB[]> {
    const fullUrl = `${ this.baseUrl }/orders/group/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<GroupOrderDB[]>(fullUrl, { headers });
  }


  updateGroup(group: Group): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.put<Group>(fullUrl, group, { headers })
      .pipe(map(group => Group.parse(group)));
  }

}