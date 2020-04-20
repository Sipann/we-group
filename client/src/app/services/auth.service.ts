import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';

import { User } from '../models/user.model';
import { ApiClientService } from './api-client.service';
import { UserInput } from '../models/user-input.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>
  userData: any;

  constructor(
    private afAuth: AngularFireAuth,
    private apiClientService: ApiClientService,
    private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['groups']);
      }
      else { this.router.navigate(['auth']); }
    })

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
      this.apiClientService.createUser(newUser)
        .subscribe()
      return result;
    } catch (error) {
      console.log('signup error', error.message);
    }
  }

}
