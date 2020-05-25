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

  fetchGroupItems$ = createEffect(() => this.actions$.pipe(
    ofType(fromGroups.GroupsActionsTypes.FetchGroupItems),
    mergeMap(action => this.groupService.fetchItems(action.payload)
      .pipe(
        map(items => {
          const args = { groupid: action.payload, items };
          return new fromGroups.GroupItemsFetched(args);
        }),
        catchError(err => {
          return of({ type: '[Groups] Fetch Group Items Fail' })
        })
      ))
  ));

  fetchGroupMembers$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.FetchGroupMembers),
      mergeMap(action => this.groupService.fetchMembers(action.payload)
        .pipe(
          map(members => {
            const args = { groupid: action.payload, members };
            return new fromGroups.GroupMembersFetched(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Group Members Fail' })
          })
        ))
    )
  );

  fetchGroupSummaries$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.FetchGroupSummary),
      mergeMap(action => this.groupService.fetchSummary(action.payload)
        .pipe(
          map(orders => {
            console.log('fetchGroupSummaries$ orders', orders);
            const args = { groupid: action.payload, orders };
            return new fromGroups.GroupSummaryFetched(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Group Summary Fail' })
          })
        ))
    )
  );

  addItem$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.AddItem),
      mergeMap(action => this.groupService.addItem(action.payload)
        .pipe(
          map(item => {
            const args = { item, groupid: action.payload.groupid };
            return new fromGroups.ItemAdded(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Add Item Fail' })
          })
        ))
    )
  );

  deleteItem$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.DeleteItem),
      mergeMap(action => this.groupService.deleteItem(action.payload.itemid)
        .pipe(
          map(itemid => {
            const args = { itemid, groupid: action.payload.groupid };
            return new fromGroups.ItemDeleted(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Delete Item Fail' })
          })
        ))
    )
  );

  updateGroup$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.UpdateGroup),
      mergeMap(action => this.groupService.updateGroup(action.payload)
        .pipe(
          map(group => {
            return new fromGroups.GroupUpdated(group);
          }),
          catchError(err => {
            return of({ type: '[Groups] Update Group Fail' })
          })
        ))
    )
  );

}