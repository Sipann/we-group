import { GroupOrderDB } from 'src/app/models/group-order-db.model';
import { PlacedOrder } from 'src/app/models/refactor/placedorder.model';

const pipeFns2 = (...fns) => {
  return function piped(v) {
    for (let fn of fns) {
      v = fn(v);
    }
    return v;
  }
};

//////////////////////////////////////////////////

const reduceArrayByPropReverse = (discriminant) => {
  console.log('ENTERING reduceArrayByPropReverse');
  return function subReduce(array) {
    try {
      return array.reduce((acc, curr) => {
        const currentDiscriminant = curr[discriminant];
        if (!currentDiscriminant) throw new Error('this discriminant does not exist on the object');
        if (acc[currentDiscriminant]) { acc[currentDiscriminant].push({ ...curr }); }
        else { acc[currentDiscriminant] = [{ ...curr }]; }
        return acc;
      }, {});
    } catch (error) {
      console.log('ERROR =>', error.message);
      return {};
    }
  }
}

const reduceArrayByValueReverse = (discriminant) => {
  return function subReduce(array) {
    try {
      return array.reduce((acc, curr) => ({
        ...acc,
        [discriminant]: (curr[discriminant] + acc[discriminant]),
      }))
    } catch (error) {
      console.log('ERROR =>', error.message);
      return [];
    }
  }
}

const aggregateByReverse = (discriminant) => {
  return function subReduce(array) {
    if (array.length > 1) {
      return reduceArrayByValueReverse(discriminant)(array);
    }
    return array;
  }
}

const applyToObjectReverse = (discriminant) => {
  return function fnToApply(fn) {
    return function subReduce(obj) {
      const result = {};
      for (let prop in obj) {
        const item = obj[prop];
        if (Array.isArray(item)) {
          result[prop] = fn(discriminant)(item);
        }
        else if (typeof item === 'object') {
          result[prop] = applyToObjectReverse(discriminant)(fn)(item);
        }
      }
      return result;
    }
  }
};

const group = (obj) => {
  console.log('ENTERING group');
  const result = {};
  for (let prop in obj) {
    let item = obj[prop];
    if (Array.isArray(item) && item.length > 1) {
      const aggregate = { ...item[0] };
      for (let i = 1; i < item.length; i++) {
        aggregate.ordereditemsquantity += item[i].ordereditemsquantity;
      }
      console.log('aggregate =>', aggregate);
      result[prop] = [{ ...aggregate }];
    }
    else if (Array.isArray(item) && item.length === 1) {
      result[prop] = item;
    }
    else if (typeof item === 'object') {
      // keeps unfolding
      result[prop] = group(item);
    }
  }
  return result;
}

const byGroupid = reduceArrayByPropReverse('groupid');
const byPlacedOrderid = applyToObjectReverse('placedorderid')(reduceArrayByPropReverse);
const byItemid = applyToObjectReverse('itemid')(reduceArrayByPropReverse);
// const groupIdenticalItems = applyToObjectReverse('ordereditemsquantity')(aggregateByReverse);

// const groupIdenticalItems2 = group(byItemid);


export const storePlacedOrders = (placedOrders) => {
  const result = pipeFns2(byGroupid, byPlacedOrderid, byItemid, group)(placedOrders);
  console.log('UTILS result =>', result);
  return result;
}


export const reducePlacedOrdersByGroupId = (placedOrders: PlacedOrder[]) => {
  return placedOrders.reduce((acc, curr) => {
    const currentGroupid = curr.groupid;
    if (acc[currentGroupid]) { acc[currentGroupid].push({ ...curr }); }
    else { acc[currentGroupid] = [{ ...curr }]; }
    return acc;
  }, {});
};

export const reducePlacedOrdersByPlacedOrderId = (placedOrders: PlacedOrder[]) => {
  return placedOrders.reduce((acc, curr) => {
    const currentPlacedOrder = curr.placedorderid;
    if (acc[currentPlacedOrder]) { acc[currentPlacedOrder].push({ ...curr }); }
    else { acc[currentPlacedOrder] = [{ ...curr }]; }
    return acc;
  }, {});
}




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