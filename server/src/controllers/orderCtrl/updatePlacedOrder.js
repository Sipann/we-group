'use strict';

import { DBFetchPlacedOrder, DBUpdatePlacedOrder } from '../../models/orderModels';
import { DBIsPlacedOrderEditable } from '../../models/utilsModels';
import { DBGetPlacedOrderById } from '../../models/testsModels';   //! move to utilsModels
import { handleErrorCtrl } from '../utils';
import { errorMessages } from '../../utils/errorMessages';


export async function updatePlacedOrder (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const { userid } = ctx.request.header;
    const orderedItems = ctx.request.body;

    if (!userid) throw new Error(errorMessages.notAllowed);

    const getPlacedOrder = await DBGetPlacedOrderById(placedorderid);
    if (!getPlacedOrder.ok) throw new Error(errorMessages.internalServerError);
    if (getPlacedOrder.payload.user_id !== userid) throw new Error(errorMessages.notAllowed);

    const availableOrderId = getPlacedOrder.payload.available_order_id;

    const placedOrderIsEditable = await DBIsPlacedOrderEditable(placedorderid);
    if (!placedOrderIsEditable.ok || !placedOrderIsEditable.payload) throw new Error(errorMessages.notAllowed);

  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}