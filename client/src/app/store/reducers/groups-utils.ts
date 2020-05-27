import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { OrderSumup } from 'src/app/models/order-sumup.model';



const reduceByUser = (data: OrderSumup[]) => {
  const result = [];
  const reduced = data.reduce((acc, current) => {
    const currentUsername = current.username;
    const item = { itemname: current.itemname, orderedquantity: current.orderedquantity };
    return acc[currentUsername]
      ? acc = { ...acc, [currentUsername]: [...acc[currentUsername], item] }
      : acc = { ...acc, [currentUsername]: [item] }
  }, {});

  for (let prop in reduced) {
    if (reduced.hasOwnProperty(prop)) {
      result.push({ username: prop, items: reduced[prop] });
    }
  }
  return result;
};

const reduceByItem = (data: OrderSumup[]) => {
  const result = [];
  const reduced = data.reduce((acc, current) => {
    const currentItemname = current.itemname;
    const currentQuantity = current.orderedquantity;
    return acc[currentItemname]
      ? acc = { ...acc, [currentItemname]: acc[currentItemname] + currentQuantity }
      : acc = { ...acc, [currentItemname]: currentQuantity }
  }, {});

  for (let prop in reduced) {
    if (reduced.hasOwnProperty(prop)) {
      result.push({
        itemname: prop,
        quantity: reduced[prop]
      });
    }
  }
  return result;
}

//

export const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);

export const updateGroupItems = (groups, payload) => groups.map(g => {
  //! Type issue on groupid
  if (g.id == payload.groupid) {
    return { ...g, items: payload.items }
  }
  return g;
});
// const updateSelectedGroupItems = (selectedGroup, payload) => ({ ...selectedGroup, items: payload.items });







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


export const addSummaryPropToGroup = (
  stateGroups: Group[],
  payload: { groupid: string, orders: OrderSumup[] }) => {
  console.log('addSummaryPropToGroup groupid', payload.groupid);
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      const summaryByItem = reduceByItem(payload.orders);
      const summaryByUser = reduceByUser(payload.orders);
      console.log('summaryByItem', summaryByItem);
      console.log('summaryByUser', summaryByUser);
      return {
        ...group,
        order: {
          byItem: reduceByItem(payload.orders),
          byUser: reduceByUser(payload.orders),
        }
      }
    }
    // console.log('addSummaryPropToGroup', group);
    return group;
  })
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
  console.log('UTILS stateGroups:', stateGroups, 'availableGroups:', availableGroups);
  const otherGroups = [];
  const mapStateGroups = {};
  stateGroups.forEach(group => {
    mapStateGroups[group.id] = true;
  });
  availableGroups.forEach(group => {
    if (!mapStateGroups[group.id]) otherGroups.push(group);
  });
  console.log('UTILS otherGroups', otherGroups);
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
