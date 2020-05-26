import * as fromGroupsActions from '../actions/groups.actions';

import {
  addItemToGroup,
  addMembersPropToGroup,
  addSummaryPropToGroup,
  deleteItemFromGroup,
  selectGroup,
  updateGroup,
} from './groups-utils';

import { Group } from 'src/app/models/group.model';

const createGroup = (groups, group) => [...groups, group];


const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);

const updateGroupItems = (groups, payload) => groups.map(g => {
  //! Type issue on groupid
  if (g.id == payload.groupid) {
    return { ...g, items: payload.items }
  }
  return g;
});
const updateSelectedGroupItems = (selectedGroup, payload) => ({ ...selectedGroup, items: payload.items });





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




    case fromGroupsActions.GroupsActionsTypes.GroupItemsFetched:
      return {
        ...state,
        selectedGroupId: state.selectedGroupId,
        selectedGroup: updateSelectedGroupItems(state.selectedGroup, action.payload),
        groups: updateGroupItems(state.groups, action.payload),
      };


    case fromGroupsActions.GroupsActionsTypes.ResetCreateGroup:
      return {
        ...state,
        groupCreated: false,
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
        ...state,
        selectedGroupId: action.payload.groupid,
        selectedGroup: selectGroup(state.groups, action.payload.groupid),
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



    //


    case fromGroupsActions.GroupsActionsTypes.GroupMembersFetched:
      return {
        ...state,
        groups: addMembersPropToGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.GroupSummaryFetched:
      return {
        ...state,
        groups: addSummaryPropToGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.GroupUpdated:
      return {
        ...state,
        groups: updateGroup(state.groups, action.payload),
      };

    case fromGroupsActions.GroupsActionsTypes.ItemAdded:
      return {
        ...state,
        groups: addItemToGroup(state.groups, action.payload),
        itemAdded: true,
      };

    case fromGroupsActions.GroupsActionsTypes.ItemDeleted:
      return {
        ...state,
        groups: deleteItemFromGroup(state.groups, action.payload),
      };


    case fromGroupsActions.GroupsActionsTypes.ResetAddItemModal:
      return {
        ...state,
        itemAdded: false,
      };

    default:
      return state;
  }
};
