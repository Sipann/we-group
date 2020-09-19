'use strict';

import { DBGetGroupByName } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function getGroupByName (ctx) {
  try {
    const { groupname } = ctx.params;
    const response = await DBGetGroupByName(groupname);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}