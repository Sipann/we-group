'use strict';

import { DBIsPlacedOrderEditable } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isPlacedOrderEditable (ctx) {
  try {
    const { placedorderid } = ctx.params;
    const response = await DBIsPlacedOrderEditable(placedorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}