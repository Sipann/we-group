'use strict';

import { DBDeletePlacedOrderById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deletePlacedOrderById (ctx) {
  try {
    const { placedorderid } = ctx.params;
    await DBDeletePlacedOrderById(placedorderid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}