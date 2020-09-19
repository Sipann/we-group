'use strict';

import { DBGetLightGroupMembers } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function getLightGroupMembers (ctx) {
  try {

    const { groupid } = ctx.params;
    const response = await DBGetLightGroupMembers(groupid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}