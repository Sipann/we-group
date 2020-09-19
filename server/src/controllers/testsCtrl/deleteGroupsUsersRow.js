'use strict';

import { DBDeleteGroupsUsersRow } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function deleteGroupsUsersRow (ctx) {
  try {
    const { groupid, userid } = ctx.params;
    await DBDeleteGroupsUsersRow(groupid, userid);
    ctx.body = { ok: true };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}