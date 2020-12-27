'use strict';

import { errorMessages } from '../../utils/errorMessages';
import { DBFetchStaticManageGroupData } from '../groupModels';
import { handleErrorModel } from '../utils';
import {
  DBIsUserIdValid,
  DBFetchGroupsUserIsMemberOf,
  DBFetchUserDataDetails,
  DBFetchUserPlacedOrders,
} from '../utilsModels';


export async function fetchUserDataCustom (userid) {
  try {
    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const userDetailsResponse = await DBFetchUserDataDetails(userid);
    if (!userDetailsResponse.ok) throw new Error(userDetailsResponse.payload);
    const userDetails = userDetailsResponse.payload;

    const userGroupsResponse = await DBFetchGroupsUserIsMemberOf(userid);
    if (!userGroupsResponse.ok) throw new Error(userGroupsResponse.payload);
    const userGroupsUserIsMemberOf = userGroupsResponse.payload;

    const userGroupsFull = async () => {
      return Promise.all(userGroupsUserIsMemberOf.map(async (group) => {
        // if (group.manager_id === userid) {
        if (group.groupmanagerid === userid) {
          // const staticManageDataResponse = await DBFetchStaticManageGroupData(userid, group.id);
          const staticManageDataResponse = await DBFetchStaticManageGroupData(userid, group.groupid);
          if (!staticManageDataResponse.ok) throw new Response(staticManageDataResponse.payload);
          // console.log('staticManageDataResponse.payload =>', staticManageDataResponse.payload);
          const fullGroup = {
            ...group,
            staticManageData: staticManageDataResponse.payload,
          };
          // console.log('fullGroup', fullGroup);
          return fullGroup;
        }
        return { ...group };
      }));
    };
    const userGroups = await userGroupsFull();
    console.log('userGroups =>', userGroups);


    const userOrdersResponse = await DBFetchUserPlacedOrders(userid);
    if (!userOrdersResponse.ok) throw new Error(userOrdersResponse.payload);
    const userOrders = userOrdersResponse.payload;
    // console.log('userOrders =>', userOrders);

    return {
      ok: true,
      payload: {
        userDetails,
        userGroups,
        userOrders
      }
    };
  } catch (error) {
    return handleErrorModel(error);
  }
}
