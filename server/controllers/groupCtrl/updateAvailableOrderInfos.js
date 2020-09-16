'use strict';

import { DBUpdateAvailableOrderInfos } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';
import { DBIsUserGroupManager } from '../../models/utilsModels';
import { errorMessages } from '../../utils/errorMessages';
import { DBGetAvailableOrderById } from '../../models/testsModels';  //! to move to utilsModels


export async function updateAvailableOrderInfos (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { orderid } = ctx.params;
    const { confirmed, delivered } = ctx.request.body;

    if (!['pending', 'ongoing', 'done'].includes(delivered)) throw new Error(errorMessages.invalidInput);

    const availableOrderResponse = await DBGetAvailableOrderById(orderid);
    if (!availableOrderResponse.ok) throw new Error(errorMessages.invalidInput);
    const availableOrder = availableOrderResponse.payload;

    if (availableOrder.delivery_status === 'done' && delivered !== 'done') throw new Error(errorMessages.invalidInput);

    const userIsGroupManager = await DBIsUserGroupManager(userid, availableOrder.group_id);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    // console.log('CTRL orderid =>', orderid, 'confirmed =>', confirmed, 'delivered =>', delivered);
    const response = await DBUpdateAvailableOrderInfos(orderid, confirmed, delivered);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
