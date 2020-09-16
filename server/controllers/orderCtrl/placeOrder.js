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
    // console.log('CTRL availableorderid =>', availableorderid, 'userid =>', userid, 'itemsOrdered =>', itemsOrdered);

    if (!userid) throw new Error(errorMessages.notAllowed);
    // console.log('CTRL passed userid check');
    if (!itemsOrdered || !itemsOrdered.length) throw new Error(errorMessages.missingArguments);
    // console.log('CTRL passed itemsOrdered check');

    const availableOrderIdIsValid = await DBIsAvailableOrderIdValid(availableorderid);
    // console.log('CTRL availableOrderIdIsValid => ', availableOrderIdIsValid);
    if (!availableOrderIdIsValid.ok || !availableOrderIdIsValid.payload) throw new Error(errorMessages.invalidInput);

    const userIdIsValid = await DBIsUserIdValid(userid);
    // console.log('CTRL userIdIsValid => ', userIdIsValid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);
    // console.log('CTRL passed userIdIsValid check');

    const getGroupId = await DBGetGroupIdOfAvailableOrder(availableorderid);
    // console.log('CTRL getGroupId =>', getGroupId);
    if (!getGroupId.ok) throw new Error(errorMessages.invalidInput);
    const groupId = getGroupId.payload;

    const userIsGroupMember = await DBIsUserGroupMember(userid, groupId);
    // console.log('CTRL userIsGroupMember => ', userIsGroupMember);
    if (!userIsGroupMember.ok || !userIsGroupMember.payload) throw new Error(errorMessages.notAllowed);

    const availableOrderResponse = await DBGetAvailableOrderById(availableorderid);
    // console.log('CTRL availableOrderResponse =>', availableOrderResponse);
    if (!availableOrderResponse.ok) throw new Error(errorMessages.invalidInput);
    const availableorder = availableOrderResponse.payload;
    // console.log('CTRL availableOrder =>', availableorder);

    const placeOrderResponse = await DBPlaceOrder(userid, availableorder, itemsOrdered);
    // console.log('CTRL placeOrderResponse => ', placeOrderResponse);

    // FETCH NEW PLACED ORDER
    // console.log('MODELS FETCHING PLACED ORDER =>', placedOrderId);
    if (placeOrderResponse.ok) {
      const response = await DBFetchPlacedOrder(placeOrderResponse.payload);
      // console.log('CTRL response =>', response);   // { ok: true, payload: '28' }
      ctx.status = 201;
      ctx.body = { ...response };
    }
    else throw new Error(response.payload);

    // if (!response.ok) throw new Error(response.payload);


    // RETURN FULL NEW PLACED ORDER
    // return { ...response };

    // if (response.ok) {
    //   ctx.status = 201;
    //   ctx.body = { ...response };
    // }
    // else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}