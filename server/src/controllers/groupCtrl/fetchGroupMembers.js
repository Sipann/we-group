'use strict';

import { DBFetchGroupMembers } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';

export async function fetchGroupMembers (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const response = await DBFetchGroupMembers(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
};
