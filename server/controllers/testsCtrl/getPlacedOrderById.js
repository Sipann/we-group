'use strict';

import { DBGetPlacedOrderById } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getPlacedOrderById (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const response = await DBGetPlacedOrderById(placedorderid);

    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}