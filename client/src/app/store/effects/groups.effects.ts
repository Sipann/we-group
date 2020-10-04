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



  // fetchGroupAvailableItems$ = createEffect(
  //   () => this.actions$.pipe(
  //     ofType(fromGroups.GroupsActionsTypes.FetchGroupAvailableOrderItems),
  //     mergeMap(action => this.groupService.fetchGroupAvailableItems(action.payload)
  //       .pipe(
  //         map(res => {
  //           console.log('EFFECTS res', res);
  //           return new fromGroups.GroupAvailableOrderItemsFetched();
  //         }),
  //         catchError(err => {
  //           return of({ type: '[Groups] Fetch Group Order Available Items Fail', err })
  //         })
  //       ))
  //   )
  // );

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








  //////////////////////////////////////////////////////////:
  // CALLED

  addExistingItemToOrder$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.AddItemToOrder),
      mergeMap(action => this.groupService.addItemToOrder(action.payload)
        .pipe(
          map(response => {
            const args = {
              groupid: action.payload.groupid,
              orderid: action.payload.orderid,
              item: response,
            };
            console.log('EFFECT addExistingItemToOrder response', args);
            return new fromGroups.ItemAddedToOrder(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Add Existing Item To Order Fail' })
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


  addNewItem$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.AddNewItem),
      mergeMap(action => this.groupService.addNewItem(action.payload)
        .pipe(
          map(response => {
            const args = {
              groupid: action.payload.groupid,
              orderid: action.payload.orderid,
              item: response,
            };
            console.log('EFFECT addNewItem response', args);
            return new fromGroups.NewItemAdded(args);
          }),
          catchError(err => {
            return of({ type: '[Groups] Add New Item Fail' })
          })
        ))
    )
  );

  // createGroup$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromGroups.GroupsActionsTypes.CreateGroup),
  //   mergeMap((action) => this.groupService.createGroup(action.payload)
  //     .pipe(
  //       map(group => new fromGroups.GroupCreated(group)),
  //       catchError(err => of({ type: '[Groups] Group Created Fail' }))
  //     ))
  // ));

  createGroup$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.CreateGroup),
      mergeMap(
        action => this.groupService.createGroup(action.payload)
          .pipe(
            map(group => new fromGroups.GroupCreated(group)),
            catchError(err => of({ type: fromGroups.GroupsActionsTypes.CreateGroupFail, payload: err }))
          ))
    ));


  // createGroup$ = createEffect(
  //   () => this.actions$.pipe(
  //   ofType(fromGroups.GroupsActionsTypes.CreateGroup),
  //   mergeMap(
  //     action => this.groupService.createGroup(action.payload)
  //       .pipe(
  //         map(group => new fromGroups.GroupCreated(group),
  //         catchError(err => of({ type: '[Groups] Group Created Fail' }))
  //       ))
  // ));


  createGroupOrder$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.CreateNewGroupOrder),
      mergeMap(action => this.groupService.createNewGroupOrder(action.payload)
        .pipe(
          map(response => {
            console.log('response', response);
            return new fromGroups.NewGroupOrderCreated(response);
          }),
          catchError(err => {
            return of({ type: '[Groups] New Group Order Create Fail' })
          })
        ))
    ));



  fetchGroupAvailableOrders$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromGroups.GroupsActionsTypes.FetchGroupAvailableOrders),
      mergeMap(action => this.groupService.fetchAvailableOrders(action.payload)
        .pipe(
          map(response => {
            // return new fromGroups.GroupAvailableItemsFetched(res);
            if (response.ok) {
              const args = { groupid: action.payload.groupid, available: response.payload };
              return new fromGroups.GroupAvailableItemsFetched(args);
            }
            throw new Error();
          }),
          catchError(err => {
            return of({ type: '[Groups] Fetch Group Available Items Fail', err })
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