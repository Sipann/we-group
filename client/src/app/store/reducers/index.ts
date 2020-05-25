import { ActionReducerMap, createSelector, createFeatureSelector, select } from '@ngrx/store';

import * as fromGroups from './groups.reducers';
import * as fromUser from './user.reducers';
import * as fromOrders from './orders.reducers';

export interface AppState {
  groups: fromGroups.GroupsState,
  user: fromUser.UserState,
  orders: fromOrders.OrdersState,
};

export const reducers: ActionReducerMap<AppState> = {
  groups: fromGroups.GroupsReducer,
  user: fromUser.UserReducer,
  orders: fromOrders.OrdersReducer,
};

//
import { UserState } from './user.reducers';
export const selectUser = (state: AppState) => state.user;
export const selectUserCurrent = createSelector(
  selectUser,
  (state: UserState) => state.currentUser,
);
//