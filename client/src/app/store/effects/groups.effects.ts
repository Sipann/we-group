import { Injectable } from '@angular/core';
import { of, EMPTY } from 'rxjs';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';

import { createEffect, Effect, Actions, ofType } from '@ngrx/effects';

import * as fromGroups from '../actions/groups.actions';
import * as fromServices from '../../services';


@Injectable({ providedIn: 'root' })
export class GroupsEffects {


  constructor(
    private actions$: Actions,
    private groupService: fromServices.GroupService,
  ) { }


  loadGroups2$ = createEffect(() => this.actions$.pipe(
    ofType(fromGroups.GroupsActionsTypes.LoadGroups),
    mergeMap(() => this.groupService.getGroups('user1')      //TODO replace 'user1' with uid
      .pipe(
        map(groups => {
          return new fromGroups.GroupsLoaded(groups);
        }),
        catchError(err => {
          return of({ type: '[Groups] Load Groups Fail' })
        })
      ))
  ));

}