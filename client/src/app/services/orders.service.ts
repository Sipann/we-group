import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { OrderOutput } from '../models/order-output.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import { selectUserCurrent } from '../store/reducers/index';
import { map, tap } from 'rxjs/operators';

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


  updateOrder(payload: { orderid: number, itemid: number, orderedid: number, quantityChange: number }[]): Observable<{ id: number, quantity: number, item_id: number, order_id: number }[]> {
    const fullUrl = `${ this.baseUrl }/orders`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    const body = payload;
    return this.httpClient.put<{ id: number, quantity: number, item_id: number, order_id: number }[]>(fullUrl, body, { headers })
      .pipe(
        tap(obj => console.log('updateOrder service response', obj))
      );
  }



  //

  fetchOrders(groupid: string): Observable<OrderOutput[]> {
    const fullUrl = `${ this.baseUrl }/orders/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<OrderOutput[]>(fullUrl, { headers })
      .pipe(
        tap(obj => console.log('fetchOrders service response', obj))
      );
  }

  // fetchGroupAvailableOrders(): Observable<??> {
  fetchGroupAvailableOrders(groupid: string) {
    const fullUrl = `${ this.baseUrl }/test/groups/orders/${ groupid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    // return this.httpClient.get<??>(fullUrl, { headers });
    return this.httpClient.get(fullUrl, { headers });
  }

  ///////////////////////////////////
  // CALLED


  fetchUserOrders(): Observable<GroupOrderDB[]> {
    const fullUrl = `${ this.baseUrl }/orders/user`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.get<GroupOrderDB[]>(fullUrl, { headers });
  }

  placeOrder(payload: {
    availableOrderid: string,
    items: { availableitemid: string, itemid: string, orderedQty: number }[]
  }): Observable<GroupOrderDB[]> {
    const fullUrl = `${ this.baseUrl }/test/orders/${ payload.availableOrderid }`;
    const headers = new HttpHeaders().append('userid', this.user$.id);
    return this.httpClient.post<GroupOrderDB[]>(fullUrl, payload.items, { headers });
  }



}