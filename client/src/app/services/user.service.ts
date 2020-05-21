import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserData } from '../store/actions/user.actions';

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

  fetchUserData(uid: string): Observable<UserData> {
    const fullUrl = `${ this.baseUrl }/user`;
    const headers = new HttpHeaders().append('userid', uid);
    return this.httpClient.get<UserData>(fullUrl, { headers });
  }

}