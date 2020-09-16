'use strict';

import { DBDeleteAvailableOrderById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';


export async function deleteAvailableOrderById (ctx) {
  try {
    const { availableorderid } = ctx.params;
    await DBDeleteAvailableOrderById(availableorderid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}