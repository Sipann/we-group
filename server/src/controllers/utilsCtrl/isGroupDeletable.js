'use strict';

import { DBIsGroupDeletable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isGroupDeletable (ctx) {
  try {
    const { groupid } = ctx.params;
    const response = await DBIsGroupDeletable(groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}