import { Group } from '../models/group.model';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { GroupInput } from '../models/group-input.model';

import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { Order } from '../models/order.model';
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

  createGroup(newGroup: Group): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<Group>(fullUrl, newGroup, { headers });
  }



  fetchMembers(groupid: number): Observable<User[]> {
    const fullUrl = `${ this.baseUrl }/groups/members/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<User[]>(fullUrl, { headers })
      .pipe(
        tap(obj => console.log('fetchMembers response', obj)),
      );
  }

  fetchSummary(groupid: number): Observable<{ username: string, itemname: string, orderedquantity: number }[]> {
    console.log('ENTERING fetchSummary Service');
    const fullUrl = `${ this.baseUrl }/groups/orders/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<{ username: string, itemname: string, orderedquantity: number }[]>(fullUrl, { headers })
      .pipe(
        tap(obj => console.log('FETCH SUMMARY RES', obj)),
      );
  }


  getGroups(userid: string): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', '9tO9WsqEqyRBP4HkZXH5NNexZ5P2');
    return this.httpClient.get<Group[]>(fullUrl, { headers });
  }

  //

  addItem(payload: { groupid: string, item: Item }): Observable<Item> {
    // const { groupid, item } = payload;
    // const body = { groupid, item };
    // const body = {...payload};        //!
    const fullUrl = `${ this.baseUrl }/groups/items`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    // return this.httpClient.post<Item>(fullUrl, body, { headers })
    return this.httpClient.post<Item>(fullUrl, payload, { headers })
      .pipe(map(item => Item.parse(item)));
  }

  deleteItem(itemid: string): Observable<number> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ itemid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.delete<number>(fullUrl, { headers });
  }


  fetchItems(groupid: string): Observable<Item[]> {
    const fullUrl = `${ this.baseUrl }/groups/items/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<Item[]>(fullUrl, { headers })
      .pipe(map(itemArr => itemArr.map(item => Item.parse(item))));
  }


  updateGroup(group: Group): Observable<Group> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.put<Group>(fullUrl, group, { headers })
      .pipe(map(group => Group.parse(group)));
  }

}