'use strict';

import { DBGetFirstAvailableOrder } from '../../models/testsModels';
import { handleErrorCtrl } from '../utils';

export async function getFirstAvailableOrder (ctx) {
  try {
    const response = await DBGetFirstAvailableOrder();
    if (response.ok) ctx.body = { ...response };
    else throw new Error(response.payload);
  } catch (error) {
    handleErrorCtrl(ctx, error);
  }
}