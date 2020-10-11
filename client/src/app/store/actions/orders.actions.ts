import { Action, createAction, props } from '@ngrx/store';

import { OrderOutput } from '../../models/order-output.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';


export enum OrdersActionsTypes {

  CreateOrder = '[Orders] Create Order',
  OrderCreated = '[Orders] Order Created',
  ResetOrderPending = '[Orders] Reset Order Pending',
  FetchUserOrders = '[Orders] Fetch User Orders',
  UserOrdersFetched = '[Orders] User Orders Fetched',
  FetchOrders = '[Orders] Fetch Orders',
  OrdersFetched = '[Orders] Orders Fetched',
  UpdateOrder = '[Orders] Update Order',
  OrderUpdated = '[Orders] Order Updated',

  PlaceOrder = '[Orders] Place Order',
  OrderPlaced = '[Orders] Order Placed',
};

export class UpdateOrder implements Action {
  readonly type = OrdersActionsTypes.UpdateOrder;
  constructor(public payload: { orderid: number, itemid: number, orderedid: number, quantityChange: number }[]) { }
};

export class OrderUpdated implements Action {
  readonly type = OrdersActionsTypes.OrderUpdated;
  constructor(private payload) { }
}

export class CreateOrder implements Action {
  readonly type = OrdersActionsTypes.CreateOrder;
  constructor(public payload: {
    groupid: number,
    deadline: string,
    orderedItems: { itemid: number, quantity: number }[]
  }) { }
};

export class OrderCreated implements Action {
  readonly type = OrdersActionsTypes.OrderCreated;
};

export class ResetOrderPending implements Action {
  readonly type = OrdersActionsTypes.ResetOrderPending;
}

export class FetchOrders implements Action {
  readonly type = OrdersActionsTypes.FetchOrders;
  constructor(public payload: { groupid: string }) { }
};

export class OrdersFetched implements Action {
  readonly type = OrdersActionsTypes.OrdersFetched;
  constructor(private payload: OrderOutput[]) { }
};

export class FetchUserOrders implements Action {
  readonly type = OrdersActionsTypes.FetchUserOrders;
};

export class PlaceOrder implements Action {
  readonly type = OrdersActionsTypes.PlaceOrder;
  constructor(public payload: {
    availableOrderid: string,
    items: { availableItemId: string, itemid: string, orderedQty: number }[]
  }) { }
};

export class OrderPlaced implements Action {
  readonly type = OrdersActionsTypes.OrderPlaced;
  constructor(private payload: GroupOrderDB[]) { }
};

export class UserOrdersFetched implements Action {
  readonly type = OrdersActionsTypes.UserOrdersFetched;
  constructor(private payload: GroupOrderDB[]) { }
};

export type OrdersActions = CreateOrder |
  OrderCreated |
  ResetOrderPending |
  FetchOrders |
  OrdersFetched |
  UpdateOrder |
  OrderUpdated |
  FetchUserOrders |
  UserOrdersFetched |
  PlaceOrder |
  OrderPlaced
  ;
