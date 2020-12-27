import * as fromGroupsActions from '../actions/groups.actions';

import {
  addGroup,
  addItemToGroup,
  addMembersPropToGroup,
  addOrdersPropToGroup,
  createGroup,
  deleteGroup,
  deleteItemFromGroup,
  removeGroup,
  selectGroup,
  setAvailableGroups,
  setAvailableOrders,
  updateAvailableOrders,
  updateAvailableOrders2,
  // updateAvailableOrders3,
  updateGroup,
  updateGroupItems,
  updateMembersPropOfGroup,
  updateStaticManageGroupData,
  updateStaticManageGroupData2,
  loadStaticManageGroupData,
} from './groups-utils';

import { Group } from 'src/app/models/group.model';
import { GroupType } from 'src/app/models/refactor/group.model';
// import { GroupAvailableOrders } from 'src/app/models/group-order-available.model';



export interface GroupsState {
  groups: GroupType[],
  availableGroups: Group[],
  selectedGroupId: number,
  selectedGroup: Group,
  loaded: boolean,
  loading: boolean,
  groupCreated: boolean,
  itemAdded: boolean,
  availableOrders: {},
  availableOrderAdded: boolean,
};

export const initialState: GroupsState = {
  groups: [],
  availableGroups: [],
  selectedGroupId: null,
  selectedGroup: null,
  loaded: false,
  loading: false,
  groupCreated: false,
  itemAdded: false,
  availableOrders: {},
  availableOrderAdded: false,
};


export const GroupsReducer = (state = initialState, action): GroupsState => {

  switch (action.type) {

    case fromGroupsActions.GroupsActionsTypes.LOAD_GROUPS_SUCCESS:
      // console.log('REDUCERS GROUPS =>', action.payload);
      return {
        ...state,
        groups: loadStaticManageGroupData(action.payload),
      };

    // case fromGroupsActions.GroupsActionsTypes.GroupItemsFetched:
    //   return {
    //     ...state,
    //     groups: updateGroupItems(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.ResetCreateGroup:
    //   return {
    //     ...state,
    //     groupCreated: false,
    //   };

    // case fromGroupsActions.GroupsActionsTypes.SelectGroup:
    //   return {
    //     ...state,
    //     selectedGroupId: action.payload.groupid,
    //     selectedGroup: selectGroup(state.groups, action.payload.groupid),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupDeleted:
    //   return {
    //     ...state,
    //     groups: deleteGroup(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.ItemAdded:
    //   return {
    //     ...state,
    //     groups: addItemToGroup(state.groups, action.payload),
    //     itemAdded: true,
    //   };

    // case fromGroupsActions.GroupsActionsTypes.ItemDeleted:
    //   return {
    //     ...state,
    //     groups: deleteItemFromGroup(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.ResetAddItemModal:
    //   return {
    //     ...state,
    //     itemAdded: false,
    //   };

    ////////////////////////////////////////////////
    // CALLED

    // case fromGroupsActions.GroupsActionsTypes.GroupCreated:
    //   return {
    //     ...state,
    //     groups: createGroup(state.groups, action.payload),
    //     groupCreated: true,
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupAvailableItemsFetched:
    //   return {
    //     ...state,
    //     availableOrders: {
    //       ...state.availableOrders,
    //       [action.payload.groupid]: { ...action.payload.available },
    //     }
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupsLoaded:
    //   console.log('REDUCERS GroupsLoaded =>', action.payload);
    //   return {
    //     ...state,
    //     // groups: action.payload,
    //     groups: updateStaticManageGroupData2(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupMembersFetched:
    //   return {
    //     ...state,
    //     groups: addMembersPropToGroup(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupOrdersFetched:
    //   return {
    //     ...state,
    //     groups: addOrdersPropToGroup(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.GroupUpdated:
    //   return {
    //     ...state,
    //     groups: updateGroup(state.groups, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.ItemAddedToOrder:
    //   return {
    //     ...state,
    //     availableOrders: updateAvailableOrders2(state.availableOrders, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.MemberAddedToGroup:
    //   return {
    //     ...state,
    //     groups: addGroup(state.groups, action.payload),
    //     availableGroups: removeGroup(state.availableGroups, action.payload.id),
    //   }

    // case fromGroupsActions.GroupsActionsTypes.NewGroupOrderCreated:
    //   return {
    //     ...state,
    //     availableOrders: updateAvailableOrders(state.availableOrders, action.payload),
    //     availableOrderAdded: true,
    //   };

    // case fromGroupsActions.GroupsActionsTypes.NewItemAdded:
    //   return {
    //     ...state,
    //     availableOrders: updateAvailableOrders2(state.availableOrders, action.payload),
    //   };

    // case fromGroupsActions.GroupsActionsTypes.OtherGroupsFetched:
    //   return {
    //     ...state,
    //     availableGroups: setAvailableGroups(state.groups, action.payload),
    //   }

    // case fromGroupsActions.GroupsActionsTypes.MemberRemovedFromGroup:
    //   return {
    //     ...state,
    //     groups: updateMembersPropOfGroup(state.groups, action.payload),
    //   }

    // case fromGroupsActions.GroupsActionsTypes.StaticManageGroupDataFetched:
    case fromGroupsActions.GroupsActionsTypes.FETCH_STATIC_MANAGE_GROUP_DATA_SUCCESS:
      const updatedGroups = updateStaticManageGroupData2(state.groups, action.payload);
      console.log('updatedGroups =>', updatedGroups);
      return {
        ...state,
        groups: updatedGroups,
      }

    case fromGroupsActions.GroupsActionsTypes.FETCH_STATIC_MANAGE_GROUP_DATA_FAIL:
      return { ...state }

    default:
      return state;
  }
};
