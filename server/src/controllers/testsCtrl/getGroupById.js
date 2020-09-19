'use strict';

import { DBGetGroupById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getGroupById (ctx) {
  try {
    const { groupid } = ctx.params;
    const response = await DBGetGroupById(groupid);

    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}