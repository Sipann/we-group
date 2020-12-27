import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';

import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as fromUser from '../actions/user.actions';
import * as fromUserServices from '../../services/user.service';

import * as fromGroups from '../actions/groups.actions';
import * as fromOrders from '../actions/orders.actions';


@Injectable({ providedIn: 'root' })
export class UserEffects {

  constructor(
    private actions$: Actions<fromUser.UserActions>,
    private userService: fromUserServices.UserService,
  ) { }

  loadUserInitialData$ = createEffect(() => this.actions$.pipe(
    ofType(fromUser.UserActionsTypes.LOAD_USER_DATA),
    mergeMap((action) => this.userService.fetchUserData(action.payload.userid)
      .pipe(
        mergeMap(userDataResponse => {
          if (userDataResponse.ok) {
            const { userDetails, userGroups, userOrders } = userDataResponse.payload;
            // console.log('EFFECTS userDataResponse =>', userDataResponse);
            console.log('EFFECTS userDataResponse.payload =>', userDataResponse.payload);
            return [
              new fromUser.LoadUserDataSuccess(userDetails),
              new fromGroups.LoadGroupsSuccess(userGroups),
              new fromOrders.FetchUserOrdersSuccess(userOrders),
            ];
          }
        }),
        catchError(err => of(new fromUser.LoadUserDataFail()))
      ))
  ));

  updateUser$ = createEffect(
    () => this.actions$.pipe(
      // ofType(fromUser.UserActionsTypes.UpdateUserProfile),
      ofType(fromUser.UserActionsTypes.UPDATE_USER_PROFILE),
      mergeMap(action => this.userService.updateUserProfile(action.payload)
        .pipe(
          // map(user => new fromUser.UserProfileUpdated(user)),
          map(user => new fromUser.UpdateUserProfileSuccess(user)),
          // catchError(err => of({ type: '[User] Update User Profile Fail' }))
          catchError(err => of(new fromUser.UpdateUserProfileFail()))
        ))
    )
  );



  // loadUser$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromUser.UserActionsTypes.LoadUserData),
  //   mergeMap((action) => this.userService.fetchUserData(action.payload.userid)
  //     .pipe(
  //       mergeMap(userDataResponse => {
  //         if (userDataResponse.ok) {
  //           const { userDetails, userGroups, userOrders } = userDataResponse.payload;
  //           console.log('EFFECTS userDataResponse =>', userDataResponse);
  //           console.log('EFFECTS userDataResponse.payload =>', userDataResponse.payload);
  //           return [
  //             new fromUser.UserDataLoaded(userDetails),
  //             new fromGroups.GroupsLoaded(userGroups),
  //             new fromOrders.UserOrdersFetched(userOrders),
  //           ];
  //         }
  //       }),
  //       catchError(err => {
  //         console.log('[User Effects] err', err.message);
  //         return of({ type: '[Fail] Load User Fail' })
  //       })
  //     ))
  // ));

};
