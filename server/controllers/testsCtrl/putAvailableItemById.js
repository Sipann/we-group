'use strict';

import { DBPutAvailableItemById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function putAvailableItemById (ctx) {
  try {
    const { availableitemid, remainingqty } = ctx.params;
    const response = await DBPutAvailableItemById(availableitemid, remainingqty);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}