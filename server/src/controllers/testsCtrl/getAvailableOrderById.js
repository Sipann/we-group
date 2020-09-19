'use strict';

import { DBGetAvailableOrderById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getAvailableOrderById (ctx) {
  try {
    const { availableorderid } = ctx.params;
    const response = await DBGetAvailableOrderById(availableorderid);

    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}