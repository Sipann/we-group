import * as fromOrdersActions from '../actions/orders.actions';

import { Group } from 'src/app/models/group.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { strictEqual } from 'assert';


export interface OrdersState {
  list: {
    date: string,
    orderid: number,
    items: { itemid: number, quantity: number }[]
  }[];
  orderCreated: boolean;
};

export const initialState: OrdersState = {
  list: [],
  orderCreated: false,
};


export const OrdersReducer = (state = initialState, action): OrdersState => {

  switch (action.type) {

    case fromOrdersActions.OrdersActionsTypes.OrderCreated:
      return {
        ...state,
        orderCreated: true,
      }

    case fromOrdersActions.OrdersActionsTypes.ResetOrderPending:
      return {
        ...state,
        orderCreated: false,
      }


    default:
      return state;
  }
};
