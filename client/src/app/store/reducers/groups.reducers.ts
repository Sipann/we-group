import * as fromGroupsActions from '../actions/groups.actions';

import { Group } from 'src/app/models/group.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';

const createGroup = (groups, group) => [...groups, group];

const updateGroup = (groups, group) => groups.map(g => {
  if (g.id == group.id) {
    const { name, description, deadline, currency, id, manager_id } = group;
    return { ...g, name, description, deadline, currency, id, manager_id };
  }
  return g;
});

const updateSelectedGroup = (group: Group) => Object.assign({}, group);


const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);

const findGroup = (groups: Group[], groupid: number) => groups.find(g => g.id === groupid);

const updateGroupItems = (groups, payload) => groups.map(g => {
  //! Type issue on groupid
  if (g.id == payload.groupid) {
    return { ...g, items: payload.items }
  }
  return g;
});
const updateSelectedGroupItems = (selectedGroup, payload) => ({ ...selectedGroup, items: payload.items });

const addItemToGroup = (groups: Group[], payload: { groupid: number, item: Item }) => {
  console.log('REDUCER ADDITEMTOGROUP payload', payload);
  return groups.map(g => {
    //! Type issue on groupid
    if (g.id == payload.groupid) {
      return {
        ...g,
        items: [...g.items, payload.item]
      }
    }
    return g;
  })
};

const addItemToSelectedGroup = (selectedGroup: Group, item: Item) => ({
  ...selectedGroup,
  items: [...selectedGroup.items, item]
});

const deleteItemFromGroup = (groups: Group[], payload: { itemid: number, groupid: number }) => {
  return groups.map(g => {
    //! TYPE ISSUE ON ITEMID
    if (g.id == payload.groupid) {
      return {
        ...g,
        //! TYPE ISSUE ON ITEMID
        items: g.items.filter(i => i.id != payload.itemid),
      }
    }
    return g;
  })
};

const deleteItemFromSelectedGroup = (selectedGroup: Group, itemid: number) => ({
  //! TYPE ISSUE ON ITEMID
  ...selectedGroup,
  items: selectedGroup.items.filter(i => i.id != itemid),
});

const addMembersPropToGroup = (
  groups: Group[],
  payload: { members: { name: string, id: string }[], groupid: number }) => {
  return groups.map(g => {
    if (g.id == payload.groupid) {
      return {
        ...g,
        members: payload.members,
      }
    }
    return g;
  })
};

const reduceByUser = (data: { username: string, itemname: string, orderedquantity: number }[]) => {
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

const reduceByItem = (data: { username: string, itemname: string, orderedquantity: number }[]) => {
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

const addSummaryPropToGroup = (
  groups: Group[],
  payload: {
    groupid: number,
    orders: { username: string, itemname: string, orderedquantity: number }[]
  }) => {
  return groups.map(g => {
    if (g.id == payload.groupid) {
      return {
        ...g,
        order: {
          byItem: reduceByItem(payload.orders),
          byUser: reduceByUser(payload.orders),
        }
      }
    }
    return g;
  })
};


export interface GroupsState {
  groups: Group[],
  selectedGroupId: number,
  selectedGroup: Group,
  loaded: boolean,
  loading: boolean,
  groupCreated: boolean,
  itemAdded: boolean,
};

export const initialState: GroupsState = {
  groups: [],
  selectedGroupId: null,
  selectedGroup: null,
  loaded: false,
  loading: false,
  groupCreated: false,
  itemAdded: false,
};


export const GroupsReducer = (state = initialState, action): GroupsState => {

  switch (action.type) {


    case fromGroupsActions.GroupsActionsTypes.GroupSummaryFetched:
      return {
        ...state,
        groups: addSummaryPropToGroup(state.groups, action.payload),
      }

    case fromGroupsActions.GroupsActionsTypes.GroupMembersFetched:
      return {
        ...state,
        groups: addMembersPropToGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.ItemDeleted:
      return {
        ...state,
        selectedGroupId: state.selectedGroupId,
        // selectedGroup: deleteItemFromSelectedGroup(state.selectedGroup, action.payload.itemid),
        selectedGroup: state.selectedGroup,
        groups: deleteItemFromGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.ItemAdded:
      return {
        ...state,
        selectedGroupId: state.selectedGroupId,
        selectedGroup: addItemToSelectedGroup(state.selectedGroup, action.payload.item),
        groups: addItemToGroup(state.groups, action.payload),
        itemAdded: true,
      };

    case fromGroupsActions.GroupsActionsTypes.GroupItemsFetched:
      return {
        ...state,
        selectedGroupId: state.selectedGroupId,
        selectedGroup: updateSelectedGroupItems(state.selectedGroup, action.payload),
        groups: updateGroupItems(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.ResetAddItemModal:
      return {
        ...state,
        itemAdded: false,
      };

    case fromGroupsActions.GroupsActionsTypes.ResetCreateGroup:
      return {
        ...state,
        groupCreated: false,
      };

    case fromGroupsActions.GroupsActionsTypes.SelectGroup:
      return {
        ...state,
        selectedGroupId: state.selectedGroupId,
        selectedGroup: findGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.GroupsLoaded:
      return {
        selectedGroup: state.selectedGroup,
        selectedGroupId: state.selectedGroupId,
        groups: action.payload,
        loaded: state.loaded,
        loading: state.loading,
        groupCreated: state.groupCreated,
        itemAdded: state.itemAdded,
      };
    case fromGroupsActions.GroupsActionsTypes.SelectGroup:
      return {
        selectedGroup: action.payload,
        selectedGroupId: state.selectedGroupId,
        groups: state.groups,  // not spread ?
        loaded: state.loaded,
        loading: state.loading,
        groupCreated: state.groupCreated,
        itemAdded: state.itemAdded,
      };


    case fromGroupsActions.GroupsActionsTypes.GroupCreated:
      return {
        selectedGroup: state.selectedGroup,
        selectedGroupId: state.selectedGroupId,
        loaded: state.loaded,
        loading: state.loading,
        groups: createGroup(state.groups, action.payload),
        groupCreated: true,
        itemAdded: state.itemAdded,
      };

    case fromGroupsActions.GroupsActionsTypes.GroupUpdated:
      return {
        selectedGroup: updateSelectedGroup(action.payload),
        selectedGroupId: state.selectedGroupId,
        loaded: state.loaded,
        loading: state.loading,
        groups: updateGroup(state.groups, action.payload),
        groupCreated: state.groupCreated,
        itemAdded: true,
      };
    case fromGroupsActions.GroupsActionsTypes.GroupDeleted:
      return {
        selectedGroup: state.selectedGroup,
        selectedGroupId: state.selectedGroupId,
        loaded: state.loaded,
        loading: state.loading,
        groups: deleteGroup(state.groups, action.payload),
        groupCreated: state.groupCreated,
        itemAdded: state.itemAdded,
      };
    default:
      return state;
  }
};