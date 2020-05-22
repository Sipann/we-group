import { Injectable } from '@angular/core';
import { of, EMPTY } from 'rxjs';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';

import { createEffect, Effect, Actions, ofType } from '@ngrx/effects';

import * as fromGroups from '../actions/groups.actions';
import * as fromGroupsServices from '../../services/group.service';


@Injectable({ providedIn: 'root' })
export class GroupsEffects {


  constructor(
    private actions$: Actions<fromGroups.GroupsActions>,
    private groupService: fromGroupsServices.GroupService,
  ) { }


  createGroup$ = createEffect(() => this.actions$.pipe(
    ofType(fromGroups.GroupsActionsTypes.CreateGroup),
    mergeMap((action) => this.groupService.createGroup(action.payload)
      .pipe(
        map(group => {
          return new fromGroups.GroupCreated(group);
        }),
        catchError(err => {
          return of({ type: '[Groups] Group Created Fail' })
        })
      ))
  ));


}