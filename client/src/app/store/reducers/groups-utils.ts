import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';

import { GroupOrderDB } from 'src/app/models/group-order-db.model';

//

export const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);

export const updateGroupItems = (groups, payload) => groups.map(g => {
  //! Type issue on groupid
  if (g.id == payload.groupid) {
    return { ...g, items: payload.items }
  }
  return g;
});

export const setAvailableOrders = (stateAvailableOrders: {}, payload) => {
  console.log('UTILS setAvailableOrders payload', payload);
  const availableOrders = { ...stateAvailableOrders };
  if (availableOrders[payload.groupid]) {
    availableOrders[payload.groupid].push(payload);
  }
  else {
    availableOrders[payload.groupid] = [payload];
  }
  console.log('UTILS availableOrders', availableOrders);
  return availableOrders;
};

const deepClone = obj => {
  const result = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (Array.isArray(obj[prop])) { result[prop] = obj[prop].map(item => deepClone(item)); }
      else if (typeof (obj[prop]) === 'object') { result[prop] = deepClone(obj[prop]); }
      else { result[prop] = obj[prop]; }
    }
  }
  return result;
};

export const updateAvailableOrders2 = (stateAvailableOrders: {}, payload) => {
  // console.log('UTILS stateAvailableOrders', stateAvailableOrders);
  // console.log('UTILS updateAvailableOrders2 payload', payload);
  const updatedAvailableOrders = deepClone(stateAvailableOrders);

  // console.log('UTILS updatedAvailableOrders2 updatedAvailableOrders', updatedAvailableOrders);

  const groupids = Object.keys(updatedAvailableOrders);
  for (let groupid of groupids) {
    if (groupid === payload.groupid) {
      const orderids = Object.keys(updatedAvailableOrders[groupid]);
      for (let orderid of orderids) {
        if (orderid === payload.orderid) {
          updatedAvailableOrders[groupid][orderid].items = [
            ...updatedAvailableOrders[groupid][orderid].items,
            payload.item
          ];
        }
      }
    }
  }

  console.log('UTILS updateAvailableOrders2 updatedItems', updatedAvailableOrders);
  return updatedAvailableOrders;
};

// export const updateAvailableOrders3 = (stateAvailableOrders: {}, payload) => {
//   const updatedAvailableOrders = deepClone(stateAvailableOrders);
// };

export const updateAvailableOrders = (stateAvailableOrders: {}, payload) => {
  console.log('UTILS updateAvailableOrders payload', payload);
  const updatedAvailableOrders = { ...stateAvailableOrders };
  if (updatedAvailableOrders[payload.groupid]) {
    updatedAvailableOrders[payload.groupid].push(payload);
  }
  else {
    updatedAvailableOrders[payload.groupid] = [payload];
  }
  console.log('UTILS updatedAvailableOrders', updatedAvailableOrders);
  return updatedAvailableOrders;
};


// UTILS

const reduceByOrderTs = (arr: GroupOrderDB[]) => {
  return arr.reduce((acc, curr) => {
    const currentOrderDeadline = curr.order_deadline_ts;
    if (acc[currentOrderDeadline]) { acc[currentOrderDeadline].push({ ...curr }); }
    else { acc[currentOrderDeadline] = [{ ...curr }]; }
    return acc;
  }, {});
};

const reduceFinal = (reducedByOrderTs) => {
  const result = {};

  for (let deadline in reducedByOrderTs) {

    const obj = {
      order_deadline_ts: deadline,
      order_delivery_ts: reducedByOrderTs[deadline][0].order_delivery_ts,
      order_delivery_status: reducedByOrderTs[deadline][0].order_delivery_status,
      order_confirmed_status: reducedByOrderTs[deadline][0].order_confirmed_status,
      summary: { byUser: {}, byItem: {} },
    };

    if (reducedByOrderTs.hasOwnProperty(deadline)) {

      const itemsOrdered = reducedByOrderTs[deadline];

      itemsOrdered.reduce((acc, curr) => {
        const username = curr.user_name;
        const currentItem = {
          itemName: curr.item_name,
          itemQty: curr.item_ordered_quantity,
        };
        if (acc[username]) {
          const itemAlreadyListed = acc[username].find(item => item.itemName === curr.item_name);
          if (itemAlreadyListed) { itemAlreadyListed.itemQty += curr.item_ordered_quantity; }
          else { acc[username].push(currentItem); }
        }
        else { acc[username] = [currentItem]; }
        return acc;
      }, obj.summary.byUser);


      itemsOrdered.reduce((acc, curr) => {
        const itemname = curr.item_name;
        const currentQty = curr.item_ordered_quantity;
        if (acc[itemname]) { acc[itemname] += currentQty; }
        else { acc[itemname] = currentQty; }
        return acc;
      }, obj.summary.byItem);

    }
    result[deadline] = obj;
  }
  return result;
};



// EXPORTS

export const addGroup = (groups: Group[], group: Group): Group[] => {
  return [...groups, group];
};

export const addItemToGroup = (
  stateGroups: Group[],
  payload: { groupid: string, item: Item }
): Group[] => {
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      return {
        ...group,
        items: [...group.items, payload.item]
      }
    }
    return group;
  });
};

export const addMembersPropToGroup = (
  stateGroups: Group[],
  payload: { members: User[], groupid: string }) => {
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      return {
        ...group,
        members: payload.members,
      }
    }
    return group;
  })
};


export const addOrdersPropToGroup = (
  stateGroups: Group[],
  payload: { groupid: string, orders: GroupOrderDB[] }
) => {
  const reducedByOrderTs = reduceByOrderTs(payload.orders);
  const ordersSummary = reduceFinal(reducedByOrderTs)

  const updatedGroups = stateGroups.map(group => {
    if (group.id === payload.groupid) {
      const updatedGroup = {
        ...group,
        orders: ordersSummary,
      };
      return updatedGroup;
    }
    return group;
  });
  return updatedGroups;
};





export const deleteItemFromGroup = (
  stateGroups: Group[],
  payload: { itemid: string, groupid: string }
): Group[] => {
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      return {
        ...group,
        items: group.items.filter(item => item.id !== payload.itemid),
      }
    }
    return group;
  });
};


export const setAvailableGroups = (stateGroups: Group[], availableGroups: Group[]): Group[] => {
  const otherGroups = [];
  const mapStateGroups = {};
  stateGroups.forEach(group => {
    mapStateGroups[group.id] = true;
  });
  availableGroups.forEach(group => {
    if (!mapStateGroups[group.id]) otherGroups.push(group);
  });
  return otherGroups;
};


export const removeGroup = (groups: Group[], groupid: string) => {
  return groups.filter(group => group.id !== groupid);
};


export const selectGroup = (
  stateGroups: Group[],
  selectedGroupid: string
): Group => {
  return stateGroups.find(group => group.id === selectedGroupid);
};


export const updateGroup = (
  stateGroups: Group[],
  updatedGroup: Group
): Group[] => stateGroups.map(g => {
  if (g.id === updatedGroup.id) {
    const { name, description, deadline, currency, id, manager_id } = updatedGroup;
    return { ...g, name, description, deadline, currency, id, manager_id };
  }
  return g;
});



///////////////////////////////////////////////////////
// CALLED

export const createGroup = (stateGroups: Group[], group: Group) => [...stateGroups, group];



///////////////////////////////////////////////////////
// EXTRACTED
