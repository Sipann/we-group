'use strict';

import pool from '../index';
import { DBFetchAvailableOrderItems, DBIsUserGroupManager } from '../utilsModels';
import {
  DBFetchGroupMembers,
  DBFetchGroupFullAvailableOrders,
} from '../groupModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchStaticManageGroupData (userid, groupid) {
  try {
    if (!userid) throw new Error(errorMessages.notAllowed);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupid);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const groupMembersResponse = await DBFetchGroupMembers(userid, groupid);
    if (!groupMembersResponse.ok) throw new Error(groupMembersResponse.payload);
    const groupMembers = groupMembersResponse.payload;

    const groupAvailableOrdersResponse = await DBFetchGroupFullAvailableOrders(userid, groupid);
    if (!groupAvailableOrdersResponse.ok) throw new Error(groupAvailableOrdersResponse.payload);
    const groupAvailableOrders = groupAvailableOrdersResponse.payload;

    return {
      ok: true,
      payload: { groupMembers, groupAvailableOrders }
    };

  } catch (error) {
    return handleErrorModel(error);
  }
}
