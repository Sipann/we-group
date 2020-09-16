'use strict';

import { DBAddUserToGroup } from '../../models/groupModels';
import { handleErrorCtrl } from '../utils';


export async function addUserToGroup (ctx) {
  try {
    const { userid } = ctx.request.header;
    const { groupid } = ctx.params;
    const response = await DBAddUserToGroup(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}
