'use strict';

import {
  DBIsUserIdValid,
  DBIsAvailableOrderIdValid,
  DBGetGroupIdOfAvailableOrder,
  DBIsUserGroupManager,
} from './index';
import { errorMessages } from '../../utils/errorMessages';
import { handleErrorModel } from '../utils';


export async function areAddAvailableItemArgsValid (userid, orderid) {
  try {
    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) return { ok: true, payload: errorMessages.notAllowed };

    const availableOrderIdIsValid = await DBIsAvailableOrderIdValid(orderid);
    if (!availableOrderIdIsValid.ok || !availableOrderIdIsValid.payload) return { ok: true, payload: errorMessages.missingArguments };

    const groupIdOfAvailableOrder = await DBGetGroupIdOfAvailableOrder(orderid);
    if (!groupIdOfAvailableOrder.ok) return { ok: true, payload: errorMessages.invalidInput };

    const userIsGroupManager = await DBIsUserGroupManager(userid, groupIdOfAvailableOrder.payload);
    if (!userIsGroupManager.ok || !userIsGroupManager.payload) return { ok: true, payload: errorMessages.notAllowed };

    return { ok: true, payload: true };

  } catch (error) {
    return handleErrorModel(error);
  }
}