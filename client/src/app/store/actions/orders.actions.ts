import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';
import { Item } from '../../models/item.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { ItemInput } from '../../models/item-input.model';
import { OrderOutput } from '../../models/order-output.model';


export enum OrdersActionsTypes {

  CreateOrder = '[Orders] Create Order',
  OrderCreated = '[Orders] Order Created',
  ResetOrderPending = '[Orders] Reset Order Pending',
  FetchOrders = '[Orders] Fetch Orders',
  OrdersFetched = '[Orders] Orders Fetched',
  UpdateOrder = '[Orders] Update Order',
  OrderUpdated = '[Orders] Order Updated',

};

export class UpdateOrder implements Action {
  readonly type = OrdersActionsTypes.UpdateOrder;
  constructor(public payload: { orderid: number, itemid: number, orderedid: number, quantityChange: number }[]) { }
};

export class OrderUpdated implements Action {
  readonly type = OrdersActionsTypes.OrderUpdated;
  constructor(private payload) { }
}

export class FetchOrders implements Action {
  readonly type = OrdersActionsTypes.FetchOrders;
  constructor(public payload: { groupid: number }) { }
};

export class OrdersFetched implements Action {
  readonly type = OrdersActionsTypes.OrdersFetched;
  constructor(private payload: OrderOutput[]) { }
};


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

export type OrdersActions = CreateOrder | OrderCreated | ResetOrderPending | FetchOrders | OrdersFetched | UpdateOrder | OrderUpdated;
