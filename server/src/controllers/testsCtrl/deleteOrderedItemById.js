'use strict';

import { DBDeleteOrderedItemById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteOrderedItemById (ctx) {
  try {
    const { ordereditemid } = ctx.params;
    await DBDeleteOrderedItemById(ordereditemid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}