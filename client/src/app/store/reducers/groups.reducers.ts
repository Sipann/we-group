import * as fromGroups from '../actions/groups.actions';

import { Action, createReducer, State, on } from '@ngrx/store';
import * as actionsGroup from '../actions/groups.actions';

import * as fromGroupsActions from '../actions/groups.actions';

import { Group } from 'src/app/models/group.model';

const createGroup = (groups, group) => [...groups, group];
const updateGroup = (groups, group) => groups.map(g => {
  return g.id === group.id ? Object.assign({}, group) : g;
});
const deleteGroup = (groups, group) => groups.filter(g => g.id !== group.id);


export interface GroupsState {
  groups: Group[],
  selectedGroup: number,
  loaded: boolean,
  loading: boolean,
};

export const initialState: GroupsState = {
  groups: [],
  selectedGroup: 1,
  loaded: false,
  loading: false,
};


export const GroupsReducer = (state = initialState, action): GroupsState => {
  switch (action.type) {
    case fromGroupsActions.GroupsActionsTypes.GroupsLoaded:
      return {
        selectedGroup: state.selectedGroup,
        groups: action.payload,
        loaded: state.loaded,
        loading: state.loading,
      };
    case fromGroupsActions.GroupsActionsTypes.SelectGroup:
      return {
        selectedGroup: action.payload,
        groups: state.groups,  // not spread ?
        loaded: state.loaded,
        loading: state.loading,
      };
    // case fromGroupsActions.GroupsActionsTypes.CreateGroup:
    //   return {
    //     selectedGroup: state.selectedGroup,
    //     loaded: state.loaded,
    //     loading: state.loading,
    //     groups: createGroup(state.groups, action.payload)
    //   };

    case fromGroupsActions.GroupsActionsTypes.GroupCreated:
      return {
        selectedGroup: state.selectedGroup,
        loaded: state.loaded,
        loading: state.loading,
        groups: createGroup(state.groups, action.payload)
      };

    case fromGroupsActions.GroupsActionsTypes.GroupUpdated:
      return {
        selectedGroup: state.selectedGroup,
        loaded: state.loaded,
        loading: state.loading,
        groups: updateGroup(state.groups, action.payload)
      };
    case fromGroupsActions.GroupsActionsTypes.GroupDeleted:
      return {
        selectedGroup: state.selectedGroup,
        loaded: state.loaded,
        loading: state.loading,
        groups: deleteGroup(state.groups, action.payload)
      };
    default:
      return state;
  }
};
