'use strict';

import { DBIsUserDeletable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isUserDeletable (ctx) {
  try {
    const { userid } = ctx.request.header;
    const response = await DBIsUserDeletable(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}