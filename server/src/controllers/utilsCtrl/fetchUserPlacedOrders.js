'use strict';

import { DBFetchUserPlacedOrders } from '../../models/utilsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function fetchUserPlacedOrders (ctx) {
  try {
    const { userid } = ctx.params;
    const response = await DBFetchUserPlacedOrders(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}