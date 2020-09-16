'use strict';

import { DBIsGroupActive } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isGroupActive (ctx) {
  try {
    const { groupid } = ctx.params;
    const response = await DBIsGroupActive(groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}