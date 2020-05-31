import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from 'src/app/models/user.model';
import { Group } from 'src/app/models/group.model';

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


  //

  fetchUserData(uid: string): Observable<{ userDetails: User, userGroups: Group[] }> {
    const fullUrl = `${ this.baseUrl }/user`;
    const headers = new HttpHeaders().append('userid', uid);
    return this.httpClient.get<{ userDetails: User, userGroups: Group[] }>(fullUrl, { headers });
  }

  updateUserProfile(updatedUser: User): Observable<User> {
    const fullUrl = `${ this.baseUrl }/users`;
    const headers = new HttpHeaders().append('userid', updatedUser.id);
    return this.httpClient.put<User>(fullUrl, updatedUser, { headers })
      .pipe(map(user => User.parse(user)));
  }


}