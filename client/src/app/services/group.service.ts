import { Group } from '../models/group.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = 'http://localhost:3000';      //TODO from config file
  private userid: string;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    this.authService.getUserUid().subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
      } else {
        this.userid = null;
      }
    })
  }




  getGroups(userid: string): Observable<Group[]> {
    const fullUrl = `${ this.baseUrl }/groups`;
    const headers = new HttpHeaders().append('userid', '9tO9WsqEqyRBP4HkZXH5NNexZ5P2');
    return this.httpClient.get<Group[]>(fullUrl, { headers });
  }

}