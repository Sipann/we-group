import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { User } from '../models/user.model';
import { ApiClientService } from './api-client.service';
import { UserInput } from '../models/user-input.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _user: any;
  _userId = new BehaviorSubject<User>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this._user = user;
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
      const baseUrl = 'http://localhost:3000';
      return this.http.post(`${ baseUrl }/users`, newUser, httpOptions)
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
      const baseUrl = 'http://localhost:3000';

      await this._user.delete();
      return this.http.delete(`${ baseUrl }/users`, httpOptions);
    } catch (error) {
      console.log('unregister error', error.message);
    }
  }

}
