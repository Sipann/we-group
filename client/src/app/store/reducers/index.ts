import { ActionReducerMap, createSelector, createFeatureSelector, select } from '@ngrx/store';

import { GroupType } from 'src/app/models/refactor/group.model';

import * as fromGroups from './groups.reducers';
import * as fromUser from './user.reducers';
import * as fromOrders from './orders.reducers';

export interface AppState {
  groupsState: fromGroups.GroupsState,
  userState: fromUser.UserState,
  ordersState: fromOrders.OrdersState,
};

export const reducers: ActionReducerMap<AppState> = {
  groupsState: fromGroups.GroupsReducer,
  userState: fromUser.UserReducer,
  ordersState: fromOrders.OrdersReducer,
};

//
import { UserState } from './user.reducers';
export const selectUser = (state: AppState) => state.userState;
export const selectGroups = (state: AppState) => state.groupsState;
export const selectPlacedOrders = (state: AppState) => state.ordersState;
export const selectUserCurrent = createSelector(
  selectUser,
  (state: UserState) => state.currentUser,
);
export const selectCurrentUser = createSelector(
  selectUser,
  (state: UserState) => state.currentUser,
);
//

// export const selectGroupsList = (state: AppState) => state.groupsState.groups;
export const selectGroupsList = createSelector(
  selectGroups,
  (groupsState) => groupsState.groups,
);

export const selectProfileData = createSelector(
  selectUser,
  selectGroups,
  (userState, groupsState) => {
    return { currentUser: userState.currentUser, groups: groupsState.groups };
  }
);

export const selectGroupWithId = createSelector(
  selectGroups,
  (groupsState, props) => groupsState.groups.find((group: GroupType) => group.groupid === props.id)
);

export const selectGroupDetailsData = createSelector(
  selectCurrentUser,
  selectGroups,
  (currentUser, groupsState, props) => {
    const group = groupsState.groups.find((group: GroupType) => group.groupid === props.groupid);
    return { currentUser, group };
  }
);

export const selectManageAvailableOrderWithId = createSelector(
  selectGroups,
  (groupsState, props) => {
    const group = groupsState.groups.find((group: GroupType) => group.groupid === props.groupid);
    return group.groupavailableorders[props.orderid];
  }
)


const shape = (placedOrdersList) => {
  const result = {};
  for (let i in placedOrdersList) {
    const placedOrder = placedOrdersList[i];
    console.log('placedOrder =>', placedOrder);
    // object with ordered items with key => item id
    console.log('keys =>', Object.keys(placedOrder));
    const firstItemForRef = (Object.keys(placedOrder))[0];
    console.log('firstItemForRef =>', firstItemForRef);
    console.log('first placedorder =>', placedOrdersList[firstItemForRef][0])
    const {
      availableorderconfirmedstatus,
      availableorderdeadlinets,
      availableorderdeliverystatus,
      availableorderdeliveryts,
      groupid,
      groupname,
      placedorderid,
      userid,
    } = placedOrdersList[firstItemForRef][0];
    const shapedPlacedOrder = {
      availableorderconfirmedstatus,
      availableorderdeadlinets,
      availableorderdeliverystatus,
      availableorderdeliveryts,
      groupid,
      groupname,
      placedorderid,
      userid,
      items: []
    };
    for (let item of placedOrder) {
      const {
        itemid,
        itemname,
        itemprice,
        ordereditemsquantity,
      } = item;
      shapedPlacedOrder.items.push({
        itemid, itemname, itemprice, ordereditemsquantity,
      });
    }
    result[i] = shapedPlacedOrder;
  }
  return result;
}

export const selectPlacedOrdersForCurrentGroup = createSelector(
  selectPlacedOrders,
  (userPlacedOrders, props) => {
    // console.log('userPlacedOrders =>', userPlacedOrders.list);
    const placedOrdersForCurrentGroup = userPlacedOrders.list[props.groupid];
    const shapedPlacedOrdersForCurrentGroup = shape(placedOrdersForCurrentGroup);
    console.log('shapedPlacedOrdersForCurrentGroup =>', shapedPlacedOrdersForCurrentGroup);
    return shapedPlacedOrdersForCurrentGroup;
  },
);