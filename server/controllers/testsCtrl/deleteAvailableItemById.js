'use strict';

import { DBDeleteAvailableItemById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteAvailableItemById (ctx) {
  try {
    const { availableitemid } = ctx.params;
    await DBDeleteAvailableItemById(availableitemid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}