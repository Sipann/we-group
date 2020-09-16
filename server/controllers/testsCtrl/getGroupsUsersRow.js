'use strict';

import { DBGetGroupsUsersRow } from '../../models/testsModels';
import { errorMessages } from '../../utils/errorMessages';

export async function getGroupsUsersRow (ctx) {
  try {
    const { groupid, userid } = ctx.params;
    const response = await DBGetGroupsUsersRow(groupid, userid);
    if (response.ok) ctx.body = { ...response };
  } catch (error) {
    ctx.throw(500, errorMessages.internalServerError);
  }
}