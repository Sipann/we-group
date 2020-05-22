import { Group } from '../models/group.model';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { GroupInput } from '../models/group-input.model';

import { User } from '../models/user.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers/index';
import { selectUserCurrent } from '../store/reducers/index';
import { GroupsState } from '../store/reducers/groups.reducers';
import { UserState } from '../store/reducers/user.reducers';
import { map } from 'rxjs/operators';

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


  getGroups(userid: string): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', '9tO9WsqEqyRBP4HkZXH5NNexZ5P2');
    return this.httpClient.get<Group[]>(fullUrl, { headers });
  }

}