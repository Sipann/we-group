import { Injectable } from '@angular/core';
import { of, EMPTY } from 'rxjs';
import { map, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';

import { createEffect, Effect, Actions, ofType } from '@ngrx/effects';

import * as fromGroups from '../actions/groups.actions';
import * as fromGroupsServices from '../../services/group.service';
import * as fromOrders from '../actions/orders.actions';
import * as fromOrdersServices from '../../services/orders.service';


@Injectable({ providedIn: 'root' })
export class OrdersEffects {


  constructor(
    private actions$: Actions<fromGroups.GroupsActions>,
    private ordersService: fromOrdersServices.OrdersService,
  ) { }

  createOrder$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromOrders.OrdersActionsTypes.CreateOrder),
      mergeMap((action) => this.ordersService.createOrder(action.payload)
        .pipe(
          map(() => {
            return new fromOrders.OrderCreated();
          }),
          catchError(err => {
            return of({ type: '[Orders] Order Create Fail' })
          })
        )
      )
    )
  )

}