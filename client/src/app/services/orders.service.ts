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
export class OrdersService {
  private baseUrl = environment.apiBaseUrl;

  user$: User;

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>,
  ) {
    this.store.select(selectUserCurrent)
      .pipe(map(user => User.parse(user)))
      .subscribe(v => this.user$ = v);
  }


  createOrder(payload): Observable<{ date: string, orderid: number, items: Item[] }> {
    const { groupid, deadline, orderedItems } = payload;
    const body = {
      items: orderedItems,
      date: deadline,
    };
    const fullUrl = `${ this.baseUrl }/orders/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<{ date: string, orderid: number, items: Item[] }>(fullUrl, body, { headers });
  }

}