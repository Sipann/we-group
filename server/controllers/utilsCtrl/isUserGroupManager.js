'use strict';

import { DBIsUserGroupManager } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isUserGroupManager (ctx) {
  try {
    const { userid, groupid } = ctx.params;
    const response = await DBIsUserGroupManager(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}