import { Group } from 'src/app/models/group.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { OrderOutput } from 'src/app/models/order-output.model';
import { OrderSummary } from 'src/app/models/ordersummary.model';
import { strictEqual } from 'assert';


const reduceByGroup = arr => {
  return arr.reduce((acc, curr) => {
    const currentGroupName = curr.group_name;
    if (acc[currentGroupName]) { acc[currentGroupName].push({ ...curr }); }
    else { acc[currentGroupName] = [{ ...curr }]; }
    return acc;
  }, {});
};

const reduceByOrder = (groupOrdersDB: GroupOrderDB[]) => {
  const reducedByGroup = reduceByGroup(groupOrdersDB);
  const result = {};

  for (let groupid in reducedByGroup) {
    if (reducedByGroup.hasOwnProperty(groupid)) {
      const ordersArr = reducedByGroup[groupid];

      const reducedOneGroup = ordersArr.reduce((acc, curr) => {
        const currentOrderDeadline = ordersArr[0].order_deadline_ts;
        if (acc[currentOrderDeadline]) { acc[currentOrderDeadline].push({ ...curr }); }
        else { acc[currentOrderDeadline] = [{ ...curr }]; }
        return acc;
      }, {});
      result[groupid] = reducedOneGroup;
    }
  }

  return result;
};


export const reduceFinal = (groupOrdersDB: GroupOrderDB[]) => {

  const reducedByOrder = reduceByOrder(groupOrdersDB);

  const result = {};

  const groupids = Object.keys(reducedByOrder);

  groupids.forEach(groupid => {
    const allOrders = {};
    const order = reducedByOrder[groupid];
    const orderkeys = Object.keys(order);

    orderkeys.forEach(orderkey => {

      const itemsOrdered = order[orderkey];

      const objOrder = {
        groupname: itemsOrdered[0].group_name,
        groupid: itemsOrdered[0].group_id,
        order_delivery_ts: itemsOrdered[0].order_delivery_ts,
        order_deadline_ts: itemsOrdered[0].order_deadline_ts,
        order_delivery_status: itemsOrdered[0].order_deadline_ts,
        order_confirmed_status: itemsOrdered[0].order_confirmed_status,
        items: {},
      };

      itemsOrdered.reduce((acc, curr) => {
        const itemname = curr.item_name;
        const itemprice = curr.item_price;
        const itemQty = curr.item_ordered_quantity;
        if (acc[itemname]) {
          acc[itemname] = {
            ...acc[itemname],
            itemQty: acc[itemname].itemQty + itemQty,
          }
        }
        else {
          acc[itemname] = {
            itemprice,
            itemQty,
          }
        }
        return acc;
      }, objOrder.items);

      allOrders[orderkey] = objOrder;

    });

    result[groupid] = allOrders;
  });

  return result;
};



export const updateOrder = (ordersList, payload) => {
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