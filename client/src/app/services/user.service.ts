import { Group } from '../models/group.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserData } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';      //TODO from config file

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