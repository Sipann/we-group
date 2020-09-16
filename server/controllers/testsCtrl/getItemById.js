'use strict';

import { DBGetItemById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getItemById (ctx) {
  try {
    const { itemid } = ctx.params;
    const response = await DBGetItemById(itemid);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}