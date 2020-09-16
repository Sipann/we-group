'use strict';

import { DBDeleteUserById } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteUserById (ctx) {
  try {
    const { userid } = ctx.params;
    await DBDeleteUserById(userid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}