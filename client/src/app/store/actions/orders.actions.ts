import { Action, createAction, props } from '@ngrx/store';

import { OrderOutput } from '../../models/order-output.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { PlacedOrder } from 'src/app/models/refactor/placedorder.model';


export enum OrdersActionsTypes {

  // CreateOrder = '[Orders] Create Order',
  // OrderCreated = '[Orders] Order Created',
  // ResetOrderPending = '[Orders] Reset Order Pending',
  // FetchUserOrders = '[Orders] Fetch User Orders',
  FETCH_USER_ORDERS = '[Orders] Fetch User Orders',
  // UserOrdersFetched = '[Orders] User Orders Fetched',
  FETCH_USER_ORDERS_FAIL = '[Orders] User Orders Fetched Fail',
  FETCH_USER_ORDERS_SUCCESS = '[Orders] User Orders Fetched Success',
  // FetchOrders = '[Orders] Fetch Orders',
  // OrdersFetched = '[Orders] Orders Fetched',
  // UpdateOrder = '[Orders] Update Order',
  // OrderUpdated = '[Orders] Order Updated',

  // PlaceOrder = '[Orders] Place Order',
  // OrderPlaced = '[Orders] Order Placed',
};

// export class UpdateOrder implements Action {
//   readonly type = OrdersActionsTypes.UpdateOrder;
//   constructor(public payload: { orderid: number, itemid: number, orderedid: number, quantityChange: number }[]) { }
// };

// export class OrderUpdated implements Action {
//   readonly type = OrdersActionsTypes.OrderUpdated;
//   constructor(private payload) { }
// }

// export class CreateOrder implements Action {
//   readonly type = OrdersActionsTypes.CreateOrder;
//   constructor(public payload: {
//     groupid: number,
//     deadline: string,
//     orderedItems: { itemid: number, quantity: number }[]
//   }) { }
// };

// export class OrderCreated implements Action {
//   readonly type = OrdersActionsTypes.OrderCreated;
// };

// export class ResetOrderPending implements Action {
//   readonly type = OrdersActionsTypes.ResetOrderPending;
// }

// export class FetchOrders implements Action {
//   readonly type = OrdersActionsTypes.FetchOrders;
//   constructor(public payload: { groupid: string }) { }
// };

// export class OrdersFetched implements Action {
//   readonly type = OrdersActionsTypes.OrdersFetched;
//   constructor(private payload: OrderOutput[]) { }
// };

export class FetchUserOrders implements Action {
  // readonly type = OrdersActionsTypes.FetchUserOrders;
  readonly type = OrdersActionsTypes.FETCH_USER_ORDERS;
};

// export class PlaceOrder implements Action {
//   readonly type = OrdersActionsTypes.PlaceOrder;
//   constructor(public payload: {
//     availableOrderid: string,
//     items: { availableItemId: string, itemid: string, orderedQty: number }[]
//   }) { }
// };

// export class OrderPlaced implements Action {
//   readonly type = OrdersActionsTypes.OrderPlaced;
//   constructor(private payload: GroupOrderDB[]) { }
// };

export class FetchUserOrdersSuccess implements Action {
  // readonly type = OrdersActionsTypes.UserOrdersFetched;
  readonly type = OrdersActionsTypes.FETCH_USER_ORDERS_SUCCESS;
  // constructor(private payload: GroupOrderDB[]) { }
  constructor(public payload: PlacedOrder[]) { }
};

export type OrdersActions = FetchUserOrdersSuccess
  //   CreateOrder |
  //   OrderCreated |
  //   ResetOrderPending |
  //   FetchOrders |
  //   OrdersFetched |
  //   UpdateOrder |
  //   OrderUpdated |
  //   PlaceOrder |
  //   OrderPlaced
  ;
