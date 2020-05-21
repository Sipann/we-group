import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';

import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as fromUser from '../actions/user.actions';
import * as fromGroups from '../actions/groups.actions';
import * as fromUserServices from '../../services/user.service';


@Injectable({ providedIn: 'root' })
export class UserEffects {


  constructor(
    private actions$: Actions<fromUser.UserActions>,
    private userService: fromUserServices.UserService,
  ) { }

  loadUser$ = createEffect(() => this.actions$.pipe(
    ofType(fromUser.UserActionsTypes.LoadUserData),
    switchMap((action) => this.userService.fetchUserData(action.payload)
      .pipe(
        switchMap(userData => [
          new fromUser.UserLoaded(userData.userDetails),
          new fromGroups.GroupsLoaded(userData.userGroups),
        ]),
        catchError(err => {
          console.log('[User Effects] err', err.message);
          return of({ type: '[User] Load User Fail' })
        })
      ))
  ));

};