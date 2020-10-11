import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

import { createEffect, Effect, Actions, ofType } from '@ngrx/effects';

import * as fromGroups from '../actions/groups.actions';
import * as fromOrders from '../actions/orders.actions';
import * as fromOrdersServices from 'src/app/services/orders.service';


@Injectable({ providedIn: 'root' })
export class OrdersEffects {

  constructor(
    private actions$: Actions<fromOrders.OrdersActions>,
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
  );

  updateOrder$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromOrders.OrdersActionsTypes.UpdateOrder),
      mergeMap(action => this.ordersService.updateOrder(action.payload)
        .pipe(
          map(order => {
            return new fromOrders.OrderUpdated(order);
          }),
          catchError(err => {
            return of({ type: '[Orders] Update Order Fail' })
          })
        ))
    )
  );

  fetchOrders$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromOrders.OrdersActionsTypes.FetchOrders),
      mergeMap(action => this.ordersService.fetchOrders(action.payload.groupid)
        .pipe(
          map(orders => {
            return new fromOrders.OrdersFetched(orders);
          }),
          catchError(err => {
            return of({ type: '[Orders] Orders Fetch Fail' })
          })
        ))
    )
  );

  fetchUserOrders$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromOrders.OrdersActionsTypes.FetchUserOrders),
      mergeMap(_ => this.ordersService.fetchUserOrders()
        .pipe(
          map(orders => {
            return new fromOrders.UserOrdersFetched(orders);
          }),
          catchError(err => {
            return of({ type: '[Orders] Fetch User Orders Fail' })
          })
        ))
    )
  );

  placeOrder$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromOrders.OrdersActionsTypes.PlaceOrder),
      mergeMap(action => this.ordersService.placeOrder(action.payload)
        .pipe(
          map(response => {
            return new fromOrders.OrderPlaced(response);
          }),
          catchError(err => {
            return of({ type: '[Orders] Place Order Fail' })
          })
        ))
    )
  );


}