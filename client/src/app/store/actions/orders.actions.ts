import { Action, createAction, props } from '@ngrx/store';

import { Group } from '../../models/group.model';
import { Item } from '../../models/item.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { ItemInput } from '../../models/item-input.model';


export enum OrdersActionsTypes {

  CreateOrder = '[Orders] Create Order',
  OrderCreated = '[Orders] Order Created',
  ResetOrderPending = '[Orders] Reset Order Pending',

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

export type OrdersActions = CreateOrder | OrderCreated | ResetOrderPending;
