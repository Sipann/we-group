'use strict';

import { DBIsGroupIdValid } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isGroupIdValid (ctx) {
  try {
    const { groupid } = ctx.params;
    const response = await DBIsGroupIdValid(groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}