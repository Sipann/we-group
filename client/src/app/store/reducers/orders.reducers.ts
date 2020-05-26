import * as fromOrdersActions from '../actions/orders.actions';

import { Group } from 'src/app/models/group.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { OrderOutput } from 'src/app/models/order-output.model';
import { OrderSummary } from 'src/app/models/ordersummary.model';
import { strictEqual } from 'assert';


const updateOrdersList = (list, order) => {
  return reduceOrders(order);
};

const reduceData = (data: OrderOutput[]) => {
  return data.reduce((acc: {}, curr: OrderSummary) => {
    const currentGroup = curr.ordergroup;
    if (acc[currentGroup]) {
      if (acc[currentGroup][curr.orderid]) {
        acc[currentGroup][curr.orderid].items = [
          ...acc[currentGroup][curr.orderid].items,
          { itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }
        ]
      }
      else {
        let newOrder = {
          [curr.orderid]: {
            orderdeadline: curr.orderdeadline,
            items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
          }
        };
        acc = {
          ...acc,
          [currentGroup]: {
            ...acc[currentGroup],
            ...newOrder
          }
        }
      }
    }
    else {
      acc = {
        ...acc,
        [currentGroup]: {
          groupname: curr.groupname,
          [curr.orderid]: {
            orderdeadline: curr.orderdeadline,
            items: [{ itemid: curr.itemid, orderedid: curr.orderedid, name: curr.itemname, quantity: curr.orderedqty }]
          }
        }
      }
    }
    return acc;
  }, {});
}

const reduceOrders = (orders) => {
  const reduced = reduceData(orders);

  const all: {
    groupid,
    groupname: string,
    orderid: number,
    deadline: string,
    items: { id?: number, name: string, quantity: number }[]
  }[] = [];

  const groupsKeys = Object.keys(reduced);

  for (let key of groupsKeys) {
    let groupname = reduced[key].groupname;
    for (let prop in reduced[key]) {
      if (reduced[key].hasOwnProperty(prop) && prop !== 'groupname') {
        all.push({
          groupid: key,
          groupname: groupname,
          orderid: +prop,
          deadline: reduced[key][prop].orderdeadline,
          items: reduced[key][prop].items,
        });
      }
    }
  }


  return all;
}

const updateOrder = (ordersList, payload) => {
  return ordersList.map(order => {
    const update = payload.find(u => u.order_id == order.orderid);
    if (update) {
      const updatedItems = order.items.map(item => {
        if (item.itemid == update.item_id) {
          return { ...item, quantity: update.quantity }
        }
        else return item;
      });
      return { ...order, items: updatedItems };
    }
    else return order;
  });
};


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

    case fromOrdersActions.OrdersActionsTypes.OrderUpdated:
      return {
        ...state,
        list: updateOrder(state.list, action.payload),
      }

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


    case fromOrdersActions.OrdersActionsTypes.OrdersFetched:
      return {
        ...state,
        list: updateOrdersList(state.list, action.payload),
      };

    default:
      return state;
  }
};
