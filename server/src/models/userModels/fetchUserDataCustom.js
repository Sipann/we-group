'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import {
  DBIsUserIdValid,
  DBFetchGroupsUserIsMemberOf,
  DBFetchUserData,
  DBFetchUserPlacedOrders,
} from '../utilsModels';


export async function fetchUserDataCustom (userid) {
  try {
    const userIdIsValid = DBIsUserIdValid(userid);
    if (!userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const userDetailsResponse = await DBFetchUserData(userid);
    if (!userDetailsResponse.ok) throw new Error(userDetailsResponse.payload);
    const userDetails = userDetailsResponse.payload;

    const userGroupsResponse = await DBFetchGroupsUserIsMemberOf(userid);
    if (!userGroupsResponse.ok) throw new Error(userGroupsResponse.payload);
    const userGroups = userGroupsResponse.payload;

    const userOrdersResponse = await DBFetchUserPlacedOrders(userid);
    if (!userOrdersResponse.ok) throw new Error(userOrdersResponse.payload);
    const userOrders = userOrdersResponse.payload;

    return {
      ok: true,
      payload: { userDetails, userGroups, userOrders }
    };
  } catch (error) {
    return handleErrorModel(error);
  }
}
