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


  addMemberToGroup$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.AddMemberToGroup),
      mergeMap(action => this.groupService.addMemberToGroup(action.payload.groupid)
        .pipe(
          map(group => {
            return new fromGroups.MemberAddedToGroup(group);
          }),
          catchError(err => {
            return of({ type: '[Groups] Add Member to Group Fail' })
          })
        ))
    )
  );


  createGroup$ = createEffect(() => this.actions$.pipe(
    ofType(fromGroups.GroupsActionsTypes.CreateGroup),
    mergeMap((action) => this.groupService.createGroup(action.payload)
      .pipe(
        map(group => new fromGroups.GroupCreated(group)),
        catchError(err => of({ type: '[Groups] Group Created Fail' }))
      ))
  ));


  deleteItem$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.DeleteItem),
      mergeMap(action => this.groupService.deleteItem(action.payload.itemid)
        .pipe(
          map(itemid => {
            const args = { itemid: '' + itemid, groupid: action.payload.groupid };
            return new fromGroups.ItemDeleted(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Delete Item Fail' })
          })
        ))
    )
  );

  fetchGroupItems$ = createEffect(() => this.actions$.pipe(
    ofType(fromGroups.GroupsActionsTypes.FetchGroupItems),
    mergeMap(action => this.groupService.fetchItems(action.payload.groupid)
      .pipe(
        map(items => {
          const args = { groupid: action.payload.groupid, items };
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
      mergeMap(action => this.groupService.fetchMembers(action.payload.groupid)
        .pipe(
          map(members => {
            const args = { groupid: action.payload.groupid, members };
            return new fromGroups.GroupMembersFetched(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Group Members Fail' })
          })
        ))
    )
  );


  fetchGroupOrders$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.FetchGroupOrders),
      mergeMap(action => this.groupService.fetchGroupOrders(action.payload.groupid)
        .pipe(
          map(orders => {
            const args = { groupid: action.payload.groupid, orders };
            return new fromGroups.GroupOrdersFetched(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Group Orders Fail' })
          })
        ))
    )
  );


  fetchOtherGroups$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.FetchOtherGroups),
      mergeMap(() => this.groupService.fetchOtherGroups()
        .pipe(
          map(groups => {
            return new fromGroups.OtherGroupsFetched(groups);
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Other Groups' })
          })
        ))
    )
  );


  updateGroup$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.UpdateGroup),
      mergeMap(action => this.groupService.updateGroup(action.payload)
        .pipe(
          map(group => new fromGroups.GroupUpdated(group)),
          catchError(err => of({ type: '[Groups] Update Group Fail' }))
        ))
    )
  );

}