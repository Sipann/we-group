'use strict';

import { DBIsPlacedOrderIdValid } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isPlacedOrderIdValid (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const response = await DBIsPlacedOrderIdValid(placedorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}