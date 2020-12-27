import * as fromOrdersActions from '../actions/orders.actions';

import {
  updateOrder,
  reduceFinal,
  reduceOrdersByGroup,
  storePlacedOrders,
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



    // case fromOrdersActions.OrdersActionsTypes.OrderCreated:
    //   return {
    //     ...state,
    //     orderCreated: true,
    //   }

    // case fromOrdersActions.OrdersActionsTypes.ResetOrderPending:
    //   return {
    //     ...state,
    //     orderCreated: false,
    //   }


    ///////////////////////////////////////////////////
    // CALLED
    // case fromOrdersActions.OrdersActionsTypes.OrderPlaced:
    //   return {
    //     ...state,
    //     //TODO update
    //   };


    // case fromOrdersActions.OrdersActionsTypes.UserOrdersFetched:
    case fromOrdersActions.OrdersActionsTypes.FETCH_USER_ORDERS_SUCCESS:
      console.log('ORDERS reducer action.payload =>', action.payload);
      const updatedPlacedOrders = storePlacedOrders(action.payload);
      console.log('updatedPlacedOrders =>', updatedPlacedOrders);
      return {
        ...state,
        // list: reduceFinal(action.payload),
        list: storePlacedOrders(action.payload),
      }


    default:
      return state;
  }
};
