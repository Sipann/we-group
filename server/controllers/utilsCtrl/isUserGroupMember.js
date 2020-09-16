'use strict';

import { DBIsUserGroupMember } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isUserGroupMember (ctx) {
  try {
    const { userid, groupid } = ctx.params;
    const response = await DBIsUserGroupMember(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}