import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';

import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as fromUser from '../actions/user.actions';
import * as fromUserServices from '../../services/user.service';
import { User } from 'src/app/models/user.model';

import * as fromGroups from '../actions/groups.actions';
import * as fromOrders from '../actions/orders.actions';
// import * as fromGroupsServices from '../../services/group.service';


@Injectable({ providedIn: 'root' })
export class UserEffects {

  constructor(
    private actions$: Actions<fromUser.UserActions>,
    private userService: fromUserServices.UserService,
  ) { }


  updateUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.UserActionsTypes.UpdateUserProfile),
      mergeMap(action => this.userService.updateUserProfile(action.payload)
        .pipe(
          map(user => new fromUser.UserProfileUpdated(user)),
          catchError(err => of({ type: '[User] Update User Profile Fail' }))
        ))
    )
  );


  loadUser1$ = createEffect(() => this.actions$.pipe(
    ofType(fromUser.UserActionsTypes.LoadUserData),
    switchMap((action) => this.userService.fetchUserData(action.payload.userid)
      .pipe(
        switchMap(userData => [
          new fromUser.UserDataLoaded(userData.userDetails),
          new fromGroups.GroupsLoaded(userData.userGroups),
          new fromOrders.UserOrdersFetched(userData.userOrders),
        ]),
        catchError(err => {
          console.log('[User Effects] err', err.message);
          return of({ type: '[Fail] Load User Fail' })
        })
      ))
  ));



};
