import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from 'src/app/models/user.model';
import { Group } from 'src/app/models/group.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { UserDataOutput } from 'src/app/models/user-data-output';

import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }


  getUser(uid: string): Observable<User> {
    const fullUrl = `${ this.baseUrl }/users`;
    const headers = new HttpHeaders().append('userid', uid);
    return this.httpClient.get<User>(fullUrl, { headers });
  }



  fetchUserData(uid: string): Observable<UserDataOutput> {
    const fullUrl = `${ this.baseUrl }/user`;
    const headers = new HttpHeaders().append('userid', uid);
    const result = this.httpClient.get<UserDataOutput>(fullUrl, { headers });
    return result;
  }


  updateUserProfile(updatedUser: User): Observable<User> {
    const fullUrl = `${ this.baseUrl }/users`;
    const headers = new HttpHeaders().append('userid', updatedUser.id);
    return this.httpClient.put<User>(fullUrl, updatedUser, { headers })
      .pipe(map(user => User.parse(user)));
  }


}