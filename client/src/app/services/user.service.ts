import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from 'src/app/models/user.model';
import { UserType } from 'src/app/models/refactor/user.model';
// import { Group } from 'src/app/models/group.model';
import { GroupType } from 'src/app/models/refactor/group.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { PlacedOrder } from 'src/app/models/refactor/placedorder.model';
// import { UserDataOutput, UserDataStaticOutput } from 'src/app/models/user-data-output';
import { Response } from 'src/app/models/common.model';
import {
  FETCH_USER_URL,
  UPDATE_USER_URL,
} from 'src/app/constants/apiCalls';
import { Store, } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import { selectUserCurrent } from '../store/reducers/index';


import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

type UserDataStaticOutput = {
  // userDetails: User,
  userDetails: UserType;
  userGroups: GroupType[],
  userOrders: PlacedOrder[],
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
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


  getUser(uid: string): Observable<User> {
    const fullUrl = `${ this.baseUrl }/users`;
    const headers = new HttpHeaders().append('userid', uid);
    return this.httpClient.get<User>(fullUrl, { headers });
  }



  // fetchUserData(uid: string): Observable<UserDataOutput> {
  fetchUserData(uid: string): Observable<Response<UserDataStaticOutput>> {
    // const fullUrl = `${ this.baseUrl }/user`;
    const headers = new HttpHeaders().append('userid', uid);
    // const result = this.httpClient.get<UserDataOutput>(fullUrl, { headers });
    // return this.httpClient.get<Response<UserDataStaticOutput>>(fullUrl, { headers });
    return this.httpClient.get<Response<UserDataStaticOutput>>(FETCH_USER_URL, { headers });
    // return result;
  }


  updateUserProfile(updatedUser: UserType): Observable<UserType> {
    // updateUserProfile(updatedUser: User): Observable<User> {
    // const fullUrl = `${ this.baseUrl }/users`;
    // const headers = new HttpHeaders().append('userid', updatedUser.id);
    const headers = new HttpHeaders().append('userid', this.user$.id);
    // return this.httpClient.put<User>(fullUrl, updatedUser, { headers })
    return this.httpClient.put<UserType>(UPDATE_USER_URL, updatedUser, { headers });
    // .pipe(map(user => User.parse(user)));
  }


}