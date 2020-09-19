'use strict';

import { DBGetAvailableItemById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getAvailableItemById (ctx) {
  try {
    const { availableitemid } = ctx.params;
    const response = await DBGetAvailableItemById(availableitemid);
    if (response.ok) ctx.body = { ok: true, payload: response.payload };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}