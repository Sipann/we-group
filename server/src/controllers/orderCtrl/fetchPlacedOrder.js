'use strict';

import { DBFetchPlacedOrder, } from '../../models/orderModels';
import {
  DBIsPlacedOrderIdValid,
  DBIsUserIdValid,
  DBDoesUserOwnPlacedOrder,
} from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function fetchPlacedOrder (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const { userid } = ctx.request.header;

    const userIdIsValid = await DBIsUserIdValid(userid);
    if (!userIdIsValid.ok || !userIdIsValid.payload) throw new Error(errorMessages.notAllowed);

    const isPlacedOrderIdValid = await DBIsPlacedOrderIdValid(placedorderid);
    if (!isPlacedOrderIdValid.ok || !isPlacedOrderIdValid.payload) throw new Error(errorMessages.invalidInput);

    const userOwnsPlacedOrder = await DBDoesUserOwnPlacedOrder(userid, placedorderid);
    if (!userOwnsPlacedOrder.ok || !userOwnsPlacedOrder.payload) throw new Error(errorMessages.notAllowed);

    const response = await DBFetchPlacedOrder(placedorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}