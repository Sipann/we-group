import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

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
