import * as fromOrdersActions from '../actions/orders.actions';

import {
  updateOrder,
  reduceFinal,
} from './orders-utils';


export interface OrdersState {
  list: {};
  orderCreated: boolean;
};

export const initialState: OrdersState = {
  list: {},
  orderCreated: false,
};


export const OrdersReducer = (state = initialState, action): OrdersState => {

  switch (action.type) {

    // case fromOrdersActions.OrdersActionsTypes.OrderUpdated:
    //   return {
    //     ...state,
    //     list: updateOrder(state.list, action.payload),
    //   }



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


    ///////////////////////////////////////////////////
    // CALLED
    case fromOrdersActions.OrdersActionsTypes.OrderPlaced:
      return {
        ...state,
        //TODO update
      };


    case fromOrdersActions.OrdersActionsTypes.UserOrdersFetched:
      return {
        ...state,
        list: reduceFinal(action.payload),
      }


    default:
      return state;
  }
};
