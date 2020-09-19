'use strict';

import { DBAreAddAvailableItemArgsValid } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function areAddAvailableItemArgsValid (ctx) {
  try {
    const { userid, orderid } = ctx.params;
    const response = await DBAreAddAvailableItemArgsValid(userid, orderid);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}