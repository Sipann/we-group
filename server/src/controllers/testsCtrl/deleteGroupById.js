'use strict';

import { DBDeleteGroupById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteGroupById (ctx) {
  try {
    const { groupid } = ctx.params;
    await DBDeleteGroupById(groupid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}