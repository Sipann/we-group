import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { GroupOrder } from 'src/app/models/group-order.model';
import { GroupOrderDB } from 'src/app/models/group-order-db.model';
// import { OrderSumup } from 'src/app/models/order-sumup.model';

//

export const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);

export const updateGroupItems = (groups, payload) => groups.map(g => {
  //! Type issue on groupid
  if (g.id == payload.groupid) {
    return { ...g, items: payload.items }
  }
  return g;
});



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


export const createGroup = (stateGroups: Group[], group: Group) => [...stateGroups, group];


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
