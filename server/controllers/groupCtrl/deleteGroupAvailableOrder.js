'use strict';

import { DBDeleteGroupAvailableOrder } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';
import { DBIsUserGroupManager, DBGetGroupIdOfAvailableOrder, DBIsAvailableOrderEditable } from '../../models/utilsModels';
import { errorMessages } from '../../utils/errorMessages';


export async function deleteGroupAvailableOrder (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { availableorderid } = ctx.params;

    const groupIdOfAvailableOrderResponse = await DBGetGroupIdOfAvailableOrder(availableorderid);
    if (!groupIdOfAvailableOrderResponse.ok) throw new Error(errorMessages.invalidInput);

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupIdOfAvailableOrderResponse.payload);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) throw new Error(errorMessages.notAllowed);

    const availableOrderIsEditable = await DBIsAvailableOrderEditable(availableorderid);
    if (!availableOrderIsEditable.ok || !availableOrderIsEditable.payload) throw new Error(errorMessages.notAllowed);

    // const response = await DBDeleteGroupAvailableOrder(availableorderid);
    // if (response.ok) ctx.body = { ...response };
    // else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
