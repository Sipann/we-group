'use strict';

import pool from '../index';
import {
  DBIsUserGroupMember,
  DBFetchGroupAvailableOrders,
  DBFetchAvailableOrderItems
} from '../utilsModels';

import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function fetchGroupFullAvailableOrders (userid, groupid) {
  try {
    const response = {};
    if (!userid) throw new Error(errorMessages.notAllowed);

    const userIsGroupMember = await DBIsUserGroupMember(userid, groupid);
    if (!userIsGroupMember.ok || !userIsGroupMember.payload) throw new Error(errorMessages.notAllowed);

    const availableOrdersResponse = await DBFetchGroupAvailableOrders(groupid);
    if (!availableOrdersResponse.ok || !Array.isArray(availableOrdersResponse.payload)) throw new Error(errorMessages.internalServerError);
    const availableOrders = availableOrdersResponse.payload;

    for (let order of availableOrders) {
      const orderItemsResponse = await DBFetchAvailableOrderItems(order.id);
      if (!orderItemsResponse.ok) throw new Error(errorMessages.internalServerError);

      response[order.id] = {
        deadlineTs: order.deadline_ts,
        deliveryTs: order.delivery_ts,
        deliveryStatus: order.delivery_status,
        confirmedStatus: order.confirmed_status,
        items: orderItemsResponse.payload,
      };
    }

    return { ok: true, payload: response };

  } catch (error) {
    return handleErrorModel(error);
  }
}