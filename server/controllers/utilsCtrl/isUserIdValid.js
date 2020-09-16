'use strict';

import { DBIsUserIdValid } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isUserIdValid (ctx) {
  try {
    const { userid } = ctx.params;
    const response = await DBIsUserIdValid(userid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}