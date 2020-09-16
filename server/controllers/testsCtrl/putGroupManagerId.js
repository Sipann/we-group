'use strict';

import { DBPutGroupManagerId } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function putGroupManagerId (ctx) {
  try {
    const { groupid, managerid } = ctx.params;
    const response = await DBPutGroupManagerId(groupid, managerid);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}