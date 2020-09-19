'use strict';

import { DBDeleteItemById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteItemById (ctx) {
  try {
    const { itemid } = ctx.params;
    await DBDeleteItemById(itemid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}