'use strict';

import { DBPlaceOrder, DBFetchPlacedOrder } from '../../models/orderModels';
import {
  DBIsAvailableOrderIdValid,
  DBGetGroupIdOfAvailableOrder,
  DBIsUserGroupMember,
  DBIsUserIdValid,
} from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';
import { DBGetAvailableOrderById } from '../../models/testsModels';   //! move to utilsModels


export async function placeOrder (ctx) {
  try {
    const { availableorderid } = ctx.params;
    const { userid } = ctx.request.header;
    const itemsOrdered = ctx.request.body;

    if (!userid) throw new Error(errorMessages.notAllowed);
    if (!itemsOrdered || !itemsOrdered.length) throw new Error(errorMessages.missingArguments);

    const availableOrderIdIsValid = await DBIsAvailableOrderIdValid(availableorderid);
    if (!availableOrderIdIsValid.ok || !availableOrderIdIsValid.payload) throw new Error(errorMessages.invalidInput);

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const getGroupId = await DBGetGroupIdOfAvailableOrder(availableorderid);
    if (!getGroupId.ok) throw new Error(errorMessages.invalidInput);
    const groupId = getGroupId.payload;

    const userIsGroupMember = await DBIsUserGroupMember(userid, groupId);
    if (!userIsGroupMember.ok || !userIsGroupMember.payload) throw new Error(errorMessages.notAllowed);

    const availableOrderResponse = await DBGetAvailableOrderById(availableorderid);
    if (!availableOrderResponse.ok) throw new Error(errorMessages.invalidInput);
    const availableorder = availableOrderResponse.payload;

    const placeOrderResponse = await DBPlaceOrder(userid, availableorder, itemsOrdered);

    // FETCH NEW PLACED ORDER
    if (placeOrderResponse.ok) {
      const response = await DBFetchPlacedOrder(placeOrderResponse.payload);
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}