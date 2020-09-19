'use strict';

import pool from '../index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';
import {
  DBFetchGroupFullAvailableOrders,
  DBFetchGroupsUserIsMemberOf
} from './index';


export async function fetchFullGroupsUserIsMemberOf () {
  try {
    const userGroupsComplete = [];

    const userGroupsResponse = await DBFetchGroupsUserIsMemberOf(userid);
    if (!userGroupsResponse.ok) throw new Error(errorMessages.internalServerError);

    const userGroups = userGroupsResponse.payload;

    for (let group of userGroups) {
      if (group.manager_id === userid) {
        const availableOrders = await DBFetchGroupFullAvailableOrders(userid, group.id)
        userGroupsComplete.push({
          ...group,
          availableOrders,
        });
      }
      else userGroupsComplete.push(group);
    }
    return userGroupsComplete;
  } catch (error) {
    return handleErrorModel(error);
  }
}