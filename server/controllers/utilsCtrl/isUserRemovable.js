'use strict';

import { DBIsUserRemovable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isUserRemovable (ctx) {
  try {
    const { userid, groupid } = ctx.params;
    const response = await DBIsUserRemovable(userid, groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}