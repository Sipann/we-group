import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { User } from '../models/user.model';
import { UserInput } from '../models/user-input.model';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers/index';

import { environment } from '../../environments/environment';

import * as fromUserActions from '../store/actions/user.actions';
import * as fromGroupsActions from '../store/actions/groups.actions';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiBaseUrl;
  _user: any;
  _userId = new BehaviorSubject<User>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this._user = user;
        this.store.dispatch(new fromUserActions.LoadUserData({ userid: user.uid }));
        this.router.navigate(['groups']);
      }
      else {
        this._user = null;
        this.router.navigate(['auth']);
      }
    })

  }

  getUserUid() {
    return this.afAuth.user;
  }


  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('can not log out!');
    }
  }


  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      console.log('error while login', error.message);
    }
  }

  async signup(email: string, name: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      // create user in database
      const newUser: UserInput = { id: result.user.uid, name, email };
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      return this.http.post(`${ this.baseUrl }/users`, newUser, httpOptions)
        .pipe(map(user => User.parse(user)))
        .subscribe();


    } catch (error) {
      console.log('signup error', error.message);
    }
  }

  async unregister() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'userid': this._user.uid,
          'Content-Type': 'application/json',
        })
      };

      await this._user.delete();
      return this.http.delete(`${ this.baseUrl }/users`, httpOptions);
    } catch (error) {
      console.log('unregister error', error.message);
    }
  }

}
