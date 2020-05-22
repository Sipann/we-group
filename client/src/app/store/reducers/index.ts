import { ActionReducerMap, createSelector, createFeatureSelector, select } from '@ngrx/store';

import * as fromGroups from './groups.reducers';
import * as fromUser from './user.reducers';

export interface AppState {
  groups: fromGroups.GroupsState,
  user: fromUser.UserState,
};

export const reducers: ActionReducerMap<AppState> = {
  groups: fromGroups.GroupsReducer,
  user: fromUser.UserReducer,
};

//
import { UserState } from './user.reducers';
export const selectUser = (state: AppState) => state.user;
export const selectUserCurrent = createSelector(
  selectUser,
  (state: UserState) => state.currentUser,
);
//