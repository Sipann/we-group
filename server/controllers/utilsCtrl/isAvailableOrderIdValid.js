'use strict';

import { DBIsAvailableOrderIdValid } from '../../models/utilsModels';
import { handleErrorCtrl } from '../utils';

export async function isAvailableOrderIdValid (ctx) {
  try {
    const { availableorderid } = ctx.params;
    const response = await DBIsAvailableOrderIdValid(availableorderid);
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}