import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { Group } from '../models/group.model';
import { GroupInput } from '../models/group-input.model';
import { Item } from '../models/item.model';
import { ItemInput } from '../models/item-input.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { OrderOutput } from '../models/order-output.model';
import { OrderSumup } from '../models/order-sumup.model';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private baseUrl = 'http://localhost:3000';
  private userid = 'user3';

  constructor(public http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
      })
    };
    return this.http.get(`${ this.baseUrl }/groups`, httpOptions)
      .pipe(map((obj: any) => obj.map(group => group)));
  }

  createGroup(group: GroupInput): Observable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(`${ this.baseUrl }/groups`, group, httpOptions)
      .pipe(map(created => created));
  }


  getGroup(groupid: number): Observable<Group> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${ this.baseUrl }/groups/detail/${ groupid }`, httpOptions)
      .pipe(map(group => Group.parse(group)));
  }

  getGroupItems(groupid: number): Observable<Item[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${ this.baseUrl }/groups/manage/${ groupid }/items`, httpOptions)
      .pipe(map((obj: any) => obj.map(item => Item.parse(item))));
  }

  getGroupMembers(groupid: number): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${ this.baseUrl }/groups/manage/${ groupid }/members`, httpOptions)
      .pipe(map((obj: any) => obj.map(user => User.parse(user))));
  }

  getGroupOrder(groupid: number, deadline: string): Observable<OrderSumup[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${ this.baseUrl }/groups/manage/${ groupid }/order/${ deadline }`, httpOptions)
      .pipe(map((obj: any) => obj.map(order => Order.parse(order))));

  }

  addItemToGroup(item: ItemInput, groupid: number): Observable<Item> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(`${ this.baseUrl }/groups/items`, { item, groupid }, httpOptions)
      .pipe(map(item => Item.parse(item)));
  }

  deleteItem(itemid: number): Observable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete(`${ this.baseUrl }/groups/items/${ itemid }`, httpOptions);
  }

  createOrder(
    groupid: number,
    date: string,
    orderedItems: { itemid: number, quantity: number }[]): Observable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    const body = {
      items: orderedItems,
      date,
    };
    return this.http.post(`${ this.baseUrl }/orders/${ groupid }`, body, httpOptions)
      .pipe(map(created => created));
  }

  getUserOrders(): Observable<OrderOutput[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${ this.baseUrl }/orders`, httpOptions)
      .pipe(map((obj: any) => obj.map(order => order)));
  }

  updateGroupInfos(data: { name: string, description: string }, groupid: number): Observable<Group> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.put(`${ this.baseUrl }/groups/infos/${ groupid }`, data, httpOptions)
      .pipe(map(group => Group.parse(group)));
  }

  updateGroupDeadline(deadline: string, groupid: number): Observable<Group> {
    const httpOptions = {
      headers: new HttpHeaders({
        'userid': this.userid,
        'Content-Type': 'application/json',
      })
    };
    return this.http.put(`${ this.baseUrl }/groups/deadline/${ groupid }`, deadline, httpOptions)
      .pipe(map(group => Group.parse(group)));
  }


}