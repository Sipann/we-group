'use strict';

import { DBFetchGroupPlacedOrders, } from '../../models/orderModels';
import {
  DBIsAvailableOrderIdValid,
  DBIsUserIdValid,
  DBIsUserGroupManager,
  DBGetGroupIdOfAvailableOrder,
} from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function fetchGroupPlacedOrders (ctx) {
  try {
    const { availableorderid } = ctx.params;
    const { userid } = ctx.request.header;

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const isAvailableOrderIdValid = await DBIsAvailableOrderIdValid(availableorderid);
    if (!isAvailableOrderIdValid.ok || !isAvailableOrderIdValid.payload) throw new Error(errorMessages.invalidInput);

    const groupIdResponse = await DBGetGroupIdOfAvailableOrder(availableorderid);
    if (!groupIdResponse.ok || !groupIdResponse.payload) throw new Error(errorMessages.internalServerError);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupIdResponse.payload);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const placedOrdersResponse = await DBFetchGroupPlacedOrders(availableorderid);
    // console.log('CTRL placedOrdersResponse', placedOrdersResponse);
    if (!placedOrdersResponse.ok || !Array.isArray(placedOrdersResponse.payload)) throw new Error(errorMessages.internalServerError);
    const placedOrders = placedOrdersResponse.payload;
    // console.log('CTRL placedOrders', placedOrders);

    const response = {
      available_order_id: placedOrders[0].available_order_id,
      deadline_ts: placedOrders[0].deadline_ts,
      delivery_ts: placedOrders[0].delivery_ts,
      delivery_status: placedOrders[0].delivery_status,
      confirmed_status: placedOrders[0].confirmed_status,
      orders: [],
    };

    for (let order of placedOrders) {
      response.orders.push({
        [order.user_name]: {
          placed_order_id: order.placed_order_id,
          item_id: order.item_id,
          item_name: order.item_name,
          item_description: order.item_description,
          item_price: order.item_price,
          item_ordered_quantity: order.item_ordered_quantity
        }
      });
    }

    ctx.body = { ok: true, payload: response };

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}